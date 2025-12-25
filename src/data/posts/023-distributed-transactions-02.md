---
id: 23
title: ACID and Saga Fundamentals
description: Deep dive into ACID properties with nuanced explanations of atomicity, consistency, isolation, and durability. Learn how sagas coordinate distributed transactions through three key dimensions, and understand why XA transactions rarely fit modern microservices architectures.
publishedDate: 2025-11-11
previewToken: n5q8t3r6b9
image: acidAndSaga.png
audience:
  - Software Architects
  - Backend Engineers
keywords:
  - distributed transactions
  - ACID properties
  - saga pattern
  - two-phase commit
  - XA transactions
  - transaction coordination
  - microservices transactions
  - orchestration vs choreography
  - synchronous vs asynchronous
  - atomic consistency
  - eventual consistency
previous: 22
next: 24
---

## Prelude

This article is heavily based on two fantastic books:

- [Software Architecture, the hard parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/), by Neal Ford, Mark Richards, Pramod Sadalage and Zhamak Dehghani
- [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/), by Martin Kleppmann

Both books tackle distributed transactions brilliantly—the former through an engineering lens, the latter from a more academic perspective. What makes this article unique is how we'll bridge these two worlds, building rock-solid fundamentals that you can actually apply to real systems.

## Recap: The data ownership foundation

In the [previous article](https://blog.dsalathe.dev/#/blog/22), we helped *Commit Esports*—a fictive esports platform—survive their scaling crisis by migrating from a monolith to microservices. We tackled the hardest part of that migration: breaking apart their database.

We established clear **data ownership patterns** (single, common, and joint ownership) and explored five **data access strategies** for reading across service boundaries—from synchronous interservice communication to data replication, caching patterns, and shared data domains. Each pattern made different tradeoffs between consistency and autonomy.

> [!todo]- Data Access Recap
> ![Data Access recap](${baseUrl}blog-images/distributed-transactions/dataAccessRecap.png)

But we left one critical question unanswered: *What happens when a single business operation needs to write to multiple services?* In their monolith, *Commit Esports* relied on database transactions to guarantee atomicity. Charge the entry fee, create the registration, update tournament capacity—all or nothing. Now those operations live in separate services with separate databases. No shared transaction coordinator. No ACID safety net.

That's the problem we're solving today: **maintaining consistency across service boundaries when operations span multiple data owners**. Welcome to the world of distributed transactions and sagas.

## Understanding the nuance of ACID

*[This section draws heavily from Martin Kleppmann's perspective on ACID transactions in "Designing Data-Intensive Applications."]*

You've heard of ACID transactions. But do you truly understand the nuances? Let's find out.

ACID stands for Atomicity, Consistency, Isolation, and Durability. Here's the challenge: Can you explain the concrete differences between what Atomicity, Consistency, and Isolation guarantee? Aren't they all just different flavors of consistency?

Let's play a game. I'll present what I believe most people understand about each property, and you try to guess whether the definition is accurate.

### Atomicity

> [!quote]- **Atomicity** ensures a transaction is fully committed or not at all. If a consumer reads the data, they will either see no rows or all of them.
> _**Atomicity** ensures a transaction is fully committed or not at all. ~~If a consumer reads the data, they will either see no rows or all of them.~~_
>
> Almost correct—but that last sentence describes **Isolation**, not Atomicity. This distinction seems trivial in modern single-database systems where both properties typically work hand-in-hand. But in distributed systems? The nuance becomes critical.
>
> **Atomicity** is about ensuring all participants either unanimously agree to commit or unanimously agree to abort. Because any system can fail or lag at any moment, it's acceptable for one service to temporarily show `+$100` while another hasn't yet reflected `-$100`—as long as both agreed to proceed. If everyone said "yes," they must follow through with the transaction. If anyone said "no," no service can show their portion as committed.
>
> **Why does this matter?** The `+$100`/`-$100` example might seem unconvincing. After all, if the first service agreed to `+$100` but the second refused `-$100`, a reader will see an incorrect total balance. But if both agreed and the second service is just slower, the reader can't tell the difference.
>
> True—but in the first scenario, the `+$100` should never have happened. In the second, the transaction is valid and will eventually complete. Let's consider a more compelling example:
>
> A customer wants to buy a laptop. **The stock service and credit service should participate in the same atomic transaction.** Without atomicity: the stock service decreases inventory from `1` to `0`—the last one!—but the credit service finds the customer's balance too low and rejects the transaction. Meanwhile, a notification service periodically checks inventory levels and, seeing zero laptops remaining, automatically emails the supplier to reorder. Too late—that email can't be recalled. Atomicity would have prevented this if all these operations belonged in the same (atomic) transaction.
>
> *Note: Atomicity assumes your implementation only reads committed data. Otherwise this laptop problem can still occur because of isolation problems.*

### Consistency

> [!quote]- **Consistency** means the database ensures that if the initial state was consistent, the transaction will maintain consistency in the next state.
> _**Consistency** means ~~the database~~ ensuring that if the initial state was consistent, the transaction will maintain consistency in the next state._
> 
> Again, almost! This isn't actually the database's responsibility—it's the **application's**. Yes, databases can enforce certain invariants, such as "the `customer_credit` column must always be non-negative." But consistency is a broad concept that typically only the application—with its full understanding of business logic—can properly guarantee.

### Isolation

> [!quote]- **Isolation** guarantees that if multiple transactions run concurrently, the result will be identical to running them sequentially, one after another.
> 
> Correct! This property is called **serializability**. However, in practice, truly guaranteeing this property might require actually running transactions sequentially, making the system prohibitively slow. So databases offer different isolation levels, each protecting against specific anomalies:
>
> ![Isolation Anomalies,- **Dirty reads**: Uncommitted rows can be read by another transaction before they're committed or aborted.- **Dirty writes**: Uncommitted updated rows can be overwritten by another transaction.- **Read skew** (non-repeatable reads): A row's value changes between two reads within the same transaction.- **Lost updates**: Two transactions update the same row without considering each other's changes, causing one update to be lost.- **Write skew**: A transaction reads data and makes a decision to write based on that reading. By the time the write occurs, the premise of that decision is no longer valid.- **Phantoms**: A transaction reads rows matching certain criteria. Another transaction writes data that affects those search results.](${baseUrl}blog-images/distributed-transactions/isolationAnomalies.png)
>
> Weaker isolation levels are generally faster but protect against fewer concurrent anomalies. PostgreSQL offers the following levels:
>
> 1. **Read uncommitted**: Provides no isolation guarantees. Other transactions may read uncommitted rows that could later be aborted. (Note: In PostgreSQL, this behaves identically to Read Committed.)
> 
> 2. **Read committed** *(PostgreSQL's default)*: Prevents *dirty reads* and *dirty writes*. Still vulnerable to *lost updates*, *phantoms*, *read skews*, and *write skews*.
> 
> 3. **Repeatable read** (Snapshot Isolation): Also protects against *read skews*. PostgreSQL's implementation additionally prevents *lost updates* and *phantoms* through its MVCC (Multi-Version Concurrency Control) architecture—when a transaction attempts to update a row that was modified by a concurrent transaction, it receives a serialization error. Still vulnerable to *write skews*.
> 
> 4. **Serializable**: The strongest level, preventing all anomalies including *write skews* and *phantoms*. Achieved through *actual serial execution*, *two-phase locking (2PL)*, or *serializable snapshot isolation (SSI)*. PostgreSQL uses SSI, which can detect serialization anomalies and abort transactions when conflicts occur.

### Durability

> [!quote]- **Durability** ensures that committed data persists even after crashes.
>
> Correct! But there's a subtle nuance worth noting. We commonly think "persistence" means writing to disk or SSD. In the distributed world, this guarantee doesn't necessarily require disk persistence—it can be satisfied by successfully replicating data across multiple nodes. If enough nodes have the data, it survives failures even if one node crashes before writing to disk.

> [!tip]- A note about BASE
> 
> You may also have heard of BASE, a clever wordplay contrasting what distributed systems prioritize over ACID's strict guarantees:
> 
> - **Basically Available**: The system prioritizes remaining operational, even if data isn't fully consistent across all nodes.
> - **Soft State**: The system's state can change over time without direct user input, due to eventual consistency mechanisms propagating updates across nodes.
> - **Eventually Consistent**: If no new updates are made, all replicas will eventually converge to the same value.
> 
> BASE is less a set of strict guarantees a database provides and more a design philosophy for distributed systems. It acknowledges that in distributed environments—especially those prioritizing high availability and partition tolerance—achieving ACID's strong consistency becomes prohibitively expensive or even impossible (as described by the CAP theorem).

## Sagas

*This section draws heavily from Mark Richards and Neal Ford's book, while incorporating Martin Kleppmann's rigorous treatment of atomicity.*

The *Commit Esports* team sits around the conference table, exhausted. They've successfully broken apart their monolith. They've established clear data ownership. They've chosen appropriate access patterns for each use case. Everything should be working smoothly now.

But there's a problem.

"*The tournament registration is broken,*" the lead developer announces, pulling up logs on the screen. "*A team paid their entry fee—payment service committed the transaction successfully. But then the tournament service timed out when trying to update the capacity. Now we've charged them, but they're not registered. And we can't just roll back the payment because that transaction already committed to its database.*"

The room falls silent. This is the harsh reality of distributed systems: you can't wrap multiple services in a single ACID transaction. Each service has its own database, its own transaction boundary. When operations span services, you lose the safety net that monolithic databases provided.

Welcome to the world of sagas—the patterns that let you maintain consistency across service boundaries when traditional ACID transactions can't help you.

### Defining sagas: Then and now

The original saga definition, introduced in 1987, was straightforward: "A saga is a sequence of local transactions. Each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga. If a local transaction fails because it violates a business rule, then the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions."

This definition served the distributed systems community well for decades. But today's microservices architectures demand a broader understanding. A more modern definition recognizes the full spectrum:

**A saga manages long-running, distributed transactions by breaking them into a sequence of local transactions.**

Let's unpack what this really means:

> [!abstract]- **Key components**
> 
> - **Local Transactions**: Each step in the saga is a local transaction within a single service's database domain. The saga coordinates these local transactions to achieve what appears to the application as a single global transaction.
> 
> - **Consistency Mechanisms**:
>   - **Compensating Transactions**: For each local transaction, a corresponding "compensation" transaction must exist that can undo the work done by that step. Think of these as application-level rollbacks.
>   - **Transaction State Management**: The saga must track each step's progress to enable recovery and compensation. A common implementation adds a `state` column to relevant tables tracking each step's status (e.g., PENDING, COMPLETED, COMPENSATING, FAILED).
> 
> - **Idempotency**: Particularly crucial for asynchronous implementations, operations must produce the same result whether executed once or multiple times. This protects against duplicate messages and retry storms.

To truly understand modern sagas, we need to explore the three dimensions that define their implementation.

### The three dimensions

Saga implementations vary across three fundamental dimensions:

- **Communication**: Synchronous vs. Asynchronous
- **Coordination**: Orchestration vs. Choreography
- **Consistency**: Atomic vs. Eventual Consistency

Let's examine each dimension in detail.

#### Communication: The protocol layer

In our earlier discussion of data access strategies, we focused on *what* data to exchange and *when*. Now we need to address *how*—the protocols and communication patterns that make sagas work.

##### REST

REST is an architectural style, and services implementing it are called RESTful services. Most developers recognize REST as a set of HTTP endpoints with standard "verbs" (GET, POST, PUT, DELETE, PATCH).

**A purist's note**: Many so-called "RESTful" services are actually RPC in disguise. True REST includes stricter constraints like hypermedia controls following the Hypermedia as the Engine of Application State (HATEOAS) principle. But in practice, most teams use a pragmatic subset: JSON payloads with conventional URL patterns.

REST communications are typically synchronous—the client makes a request and waits for a response:

> [!example]- Sync Rest
> ![Sync REST](${baseUrl}blog-images/distributed-transactions/communicationRestSync.png)

However, you can simulate asynchronous behavior with callbacks or polling:

> [!example]- Async Rest
> ![Async REST](${baseUrl}blog-images/distributed-transactions/communicationRestAsync.png)

> [!tip]- **Tradeoffs**
> ![REST tradeoffs,- **Pros**:  - Simple and universally understood  - Stateless design enables easy horizontal scaling  - Human-readable payloads  - Seamless browser integration  - Extensive tooling and ecosystem support - **Cons**:  - Verbose payloads increase bandwidth  - Risk of stamp coupling or endpoint proliferation  - Over-fetching or under-fetching data  - Multiple round trips needed for related data  - Inefficient for real-time updates](${baseUrl}blog-images/distributed-transactions/restTradeoffs.png)
> 
> **Note**: Stamp coupling is about depending on a composite data contract but only using a portion of it. Over-fetching is related but is about the bandwidth problem (one can use a weaker data contract that doesn't map the unused parts, avoiding stamp coupling). Under-fetching is the opposite problem: your service requires more attribute so it needs to make further calls. Stamp coupling and over/under-fetching can be mitigated with GraphQL, though this introduces server complexity, harder security governance, and potentially expensive queries without proper safeguards. GraphQL is a declarative data fetching language that express explicit queries rather than fetching predefine objects exposed by RESTfull services.

> [!todo] Best For
> North-south communication (external clients to services).

##### Messaging

Messaging relies on intermediary message brokers (RabbitMQ, Kafka, ActiveMQ, AWS SQS, Azure Service Bus) where producers send messages to queues or topics, and consumers retrieve them asynchronously.

Messaging is inherently asynchronous:

> [!example]- Async Messaging
> ![Async Messaging](${baseUrl}blog-images/distributed-transactions/communicationMessageAsync.png)

Though you can simulate synchronous patterns with request-reply queues:

> [!example]- Sync Messaging
> ![Sync Messaging](${baseUrl}blog-images/distributed-transactions/communicationMessageSync.png)

> [!tip]- **Tradeoffs**
> ![Message tradeoffs,- **Pros**:  - Strong decoupling between services  - Superior fault tolerance through message buffering  - Handles traffic spikes gracefully  - Enables non-blocking operations  - Supports event-driven architectures  - Multiple consumers can process the same events- **Cons**:  - Additional infrastructure complexity  - Eventual consistency challenges  - Harder to debug distributed flows  - Message ordering complexities  - Broker can become a single point of failure (mitigated with clustering)](${baseUrl}blog-images/distributed-transactions/messageTradeoffs.png)


> [!todo] Best For
> East-west communication (service-to-service) when decoupling and asynchronous processing are priorities.

##### gRPC

Google Remote Procedure Call (gRPC) is a framework using Protocol Buffers for serialization and HTTP/2 for transport. It supports both synchronous and asynchronous communication patterns.

> [!example]- Synchronous Unary RPC
> ![Sync gRPC](${baseUrl}blog-images/distributed-transactions/communicationGrpcSync.png)

> [!example]- Asynchronous Streaming
> ![Async gRPC](${baseUrl}blog-images/distributed-transactions/communicationGrpcAsync.png)

> [!tip]- **Tradeoffs**
> ![gRPC tradeoffs,- **Pros**:  - High performance with binary serialization  - Low latency over persistent HTTP/2 connections  - Strongly typed contracts reduce runtime errors  - Built-in streaming support (unidirectional and bidirectional)  - Efficient for microservices communication- **Cons**:  - Tighter coupling through shared Protocol Buffer contracts  - Binary format is not human-readable  - Steeper learning curve  - Limited browser support  - Requires HTTP/2 infrastructure](${baseUrl}blog-images/distributed-transactions/gRPCTradeoffs.png)


> [!todo] Best For
> East-west communication (service-to-service) with low-latency requirements.

#### Coordination: Who's in charge?

The *Commit Esports* team faces a crucial decision: should they use orchestration or choreography for their tournament registration process? The workflow spans multiple services—registration, team validation, payment, and email notifications. Someone (or something) needs to coordinate this dance.

##### Orchestration: The conductor pattern

In orchestration, a central orchestrator service manages the entire transaction lifecycle. Think of it as a conductor directing an orchestra—it knows the score, cues each musician, and handles any mistakes.

> [!success]- Successful registration workflow
> 
> ![Successful orchestration](${baseUrl}blog-images/distributed-transactions/coordinationOrchestrationSuccess.png)

> [!failure]- Error management with compensating transactions
> 
> ![Error orchestration](${baseUrl}blog-images/distributed-transactions/coordinationOrchestrationFailure.png)

> [!tip] When to use orchestration
> ![when to use orchestration,- Complex business rules require centralized logic- You need sophisticated error handling strategies- Explicit transaction visibility and monitoring matter- Recovery operations must be carefully sequenced](${baseUrl}blog-images/distributed-transactions/orchestrationBestFor.png)
> 
> **Tradeoffs:**
> - **Pros**: Clear transaction flow, easier debugging, centralized error handling
> - **Cons**: Orchestrator becomes a single point of failure, potential bottleneck, tighter coupling to orchestrator service

##### Choreography: The dance pattern

In choreography, no central coordinator exists—each service knows its role and responds to events from other services. Like dancers in a choreographed performance, each service knows when to act based on what others do.

> [!success]- Successful registration workflow
> 
> ![Successful choreography](${baseUrl}blog-images/distributed-transactions/coordinationChoreographySuccess.png)

> [!failure]- Error management through event propagation
> 
> ![Error choreography](${baseUrl}blog-images/distributed-transactions/coordinationChoreographyFailure.png)

> [!tip] When to use choreography
> ![when to use choreography,- Prioritizing system responsiveness- Maximizing scalability and throughput- Fire-and-forget operations are acceptable- Simple workflows with few participants](${baseUrl}blog-images/distributed-transactions/choreographyBestFor.png)
> 
> **Tradeoffs:**
> - **Pros**: No single point of failure, better scalability, lower latency
> - **Cons**: Harder to understand complete flow, debugging complexity, risk of cyclic dependencies

#### Consistency: The spectrum of guarantees

Here's where we need to be careful with terminology. Consistency isn't a binary choice between "atomic" and "eventual." And what do we really mean by "consistency"? Perfect isolation? ACID-style atomicity? Something else entirely?

For our discussion, let's establish clear definitions:

- **Atomic consistency**: The saga provides ACID-style atomicity—either all services agree to commit the transaction, or all services agree to abort it
- **Eventual consistency**: The saga coordinates operations but doesn't guarantee atomicity; the system may temporarily show impossible statements during execution

The choice between these depends on your business requirements and the tradeoffs you're willing to make.

### XA transactions: The controversial option

Introduced in 1991, X/Open XA (eXtended Architecture) is a standard for implementing two-phase commit (2PC) across heterogeneous technologies. It's supported by many databases (PostgreSQL, MySQL, DB2, SQL Server, Oracle) and message brokers (ActiveMQ, HornetQ, MSMQ, IBM MQ).

> [!tip] 2PL and 2PC are very different things
> Two-phase locking is an algorithm to achieve a *serializabality* isolation, while two-phase commit is to achieve *atomicity*.

Two-phase commit works in two phases:

1. **Prepare phase** (voting): The coordinator gives instructions and asks each participant, "Can you commit?"
2. **Commit/Abort phase** (decision): Based on the votes, the coordinator tells everyone to either commit or abort

The main purpose of this protocol is to ensure atomicity—in the ACID sense—over a distributed transaction.

**How it works:**

XA is essentially an API for interfacing with a transaction coordinator. In Java ecosystems, XA transactions are implemented using the Java Transaction API (JTA), with support through JDBC drivers for databases and JMS APIs for message brokers.

XA assumes your application uses network drivers to communicate with participant databases or messaging services. The driver exposes callbacks through which the coordinator can ask participants to prepare, commit, or abort.

In practice, the coordinator is a library loaded into the same process as the application issuing the transaction. It maintains a log on local disk to track the commit/abort decision for each transaction.

**The problems:**

If the application crashes, the coordinator goes with it. Any participants with prepared but uncommitted transactions are stuck "in doubt". This can lead to row-level exclusive locks held indefinitely, blocking other transactions from accessing those rows.

In theory, restarting the coordinator reads the log and resolves all in-doubt transactions. In practice, orphaned in-doubt transactions do occur, and manual administrator intervention becomes necessary. Rebooting database servers won't fix this—if 2PC is correctly implemented, the database will maintain the in-doubt state until the coordinator decides.

A concrete example for *Commit Esports*:

> [!success]- Successful XA transaction
> ![XA transactions](${baseUrl}blog-images/distributed-transactions/xaSuccess.png)

> [!failure]- Error management XA transaction
> ![XA transactions](${baseUrl}blog-images/distributed-transactions/xaFailure.png)

**The verdict:**

Remember the First Law of Software Architecture: **everything in software architecture is a tradeoff**. While XA transactions have earned a terrible reputation in the microservices world, they may still be appropriate for specific scenarios where strong consistency outweighs availability concerns.

However, their bad reputation is well-deserved. By choosing XA transactions, you're essentially importing one of the monolith's most significant flaws—blocking, coordinated commits—into your distributed system. You've distributed your system's components but retained its most problematic coupling mechanism.

For most modern microservices architectures, sagas provide a more pragmatic path forward.

### Mark Richards and Neal Ford's saga taxonomy

If we treat each dimension as a binary choice, we can theoretically implement 2 × 2 × 2 = 8 different types of sagas. While some combinations prove impractical in real-world systems, this taxonomy serves as a powerful mental model. It helps us understand why certain patterns emerge naturally while others feel forced.

But exploring these eight patterns requires more than a quick overview. Each pattern has its own character, its own tradeoffs, its own place in the architectural toolbox. Some are elegant and practical. Others are complex warnings about paths best avoided.

In the next article, we'll systematically explore all eight saga patterns—from the straightforward Epic Saga to the wonderfully decoupled Anthology Saga, and yes, even the aptly named Horror Story Saga. We'll see concrete examples of how *Commit Esports* might apply each pattern, understand when to choose one over another, and learn which patterns to avoid entirely.

The journey from theory to practice continues. Let's meet these eight patterns and discover which ones belong in your architectural repertoire.
