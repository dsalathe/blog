---
id: 23
title: Distributed Transactions - ACID meaning and Sagas
description: TODO
publishedDate: 2025-10-30
image: sherlockPart7.png
audience:
  - Architects
keywords:
  - TODO
previous: 22
---

## Prelude

This article is heavily based on two fantastic books:

- [Software Architecture, the hard parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/), by Neal Ford, Mark Richards, Pramod Sadalage and Zhamak Dehghani
- [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/), by Martin Kleppmann

Both books tackle distributed transactions brilliantly—the former through an engineering lens, the latter from a more academic perspective. What makes this article unique is how we'll bridge these two worlds, building rock-solid fundamentals that you can actually apply to real systems.

## Recap: The data ownership foundation

In the [previous article](https://dsalathe.github.io/blog/#/blog/22), we helped *Commit Esports*—a fictive esports platform—survive their scaling crisis by migrating from a monolith to microservices. We tackled the hardest part of that migration: breaking apart their database.

We established clear **data ownership patterns** (single, common, and joint ownership) and explored five **data access strategies** for reading across service boundaries—from synchronous interservice communication to data replication, caching patterns, and shared data domains. Each pattern made different tradeoffs between consistency and autonomy.

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
> A customer wants to buy a laptop. A stock service decreases inventory from `1` to `0`—the last one! However, a credit service finds the customer's balance too low and rejects the transaction. The problem? A notification service periodically checks inventory levels and, seeing zero laptops remaining, automatically emails the supplier to reorder. Too late—that email can't be recalled. Atomicity would have prevented this.

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
> - **Dirty reads**: Uncommitted rows can be read by another transaction before they're committed or aborted.
> - **Dirty writes**: Uncommitted updated rows can be overwritten by another transaction.
> - **Read skew** (non-repeatable reads): A row's value changes between two reads within the same transaction.
> - **Lost updates**: Two transactions update the same row without considering each other's changes, causing one update to be lost.
> - **Write skew**: A transaction reads data and makes a decision to write based on that reading. By the time the write occurs, the premise of that decision is no longer valid.
> - **Phantoms**: A transaction reads rows matching certain criteria. Another transaction writes data that affects those search results.
>
> Weaker isolation levels are generally faster but protect against fewer concurrent anomalies. PostgreSQL offers the following levels:
>
> 1. **Read uncommitted**: Provides no isolation guarantees. Other transactions may read uncommitted rows that could later be aborted. (Note: In PostgreSQL, this behaves identically to Read Committed.)
> 
> 2. **Read committed** *(PostgreSQL's default)*: Prevents *dirty reads* and *dirty writes*. Still vulnerable to *lost updates*, *phantoms*, *read skews*, and *write skews*.
> 
> 3. **Repeatable read** (Snapshot Isolation): Also protects against *read skews* and *phantoms*. PostgreSQL's implementation additionally prevents *lost updates* through its MVCC (Multi-Version Concurrency Control) architecture—when a transaction attempts to update a row that was modified by a concurrent transaction, it receives a serialization error. Still vulnerable to *write skews*.
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

**Key components:**

- **Local Transactions**: Each step in the saga is a local transaction within a single service's database domain. The saga coordinates these local transactions to achieve what appears to the application as a single global transaction.

- **Consistency Mechanisms**:
  - **Compensating Transactions**: For each local transaction, a corresponding "compensation" transaction must exist that can undo the work done by that step. Think of these as application-level rollbacks.
  - **Transaction State Management**: The saga must track each step's progress to enable recovery and compensation. A common implementation adds a `state` column to relevant tables tracking each step's status (e.g., PENDING, COMPLETED, COMPENSATING, FAILED).

- **Idempotency**: Particularly crucial for asynchronous implementations, operations must produce the same result whether executed once or multiple times. This protects against duplicate messages and retry storms.

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

![Sync REST](tobeincluded)

However, you can simulate asynchronous behavior with callbacks or polling:

![Async REST](tobeincluded)

**Tradeoffs:**

- **Pros**:
  - Simple and universally understood
  - Stateless design enables easy horizontal scaling
  - Human-readable payloads
  - Seamless browser integration
  - Extensive tooling and ecosystem support

- **Cons**:
  - Verbose payloads increase bandwidth
  - Risk of stamp coupling or endpoint proliferation
  - Over-fetching or under-fetching data
  - Multiple round trips needed for related data
  - Inefficient for real-time updates

**Note**: Stamp coupling and over/under-fetching can be mitigated with GraphQL, though this introduces server complexity, harder security governance, and potentially expensive queries without proper safeguards.

**Best for**: North-south communication (external clients to services).

For the remainder of this article, we'll assume synchronous communication uses REST.

##### Messaging

Messaging relies on intermediary message brokers (RabbitMQ, Kafka, ActiveMQ, AWS SQS, Azure Service Bus) where producers send messages to queues or topics, and consumers retrieve them asynchronously.

Messaging is inherently asynchronous:

![Async Messaging](tobeincluded)

Though you can simulate synchronous patterns with request-reply queues:

![Sync Messaging](tobeincluded)

**Tradeoffs:**

- **Pros**:
  - Strong decoupling between services
  - Superior fault tolerance through message buffering
  - Handles traffic spikes gracefully
  - Enables non-blocking operations
  - Supports event-driven architectures
  - Multiple consumers can process the same events

- **Cons**:
  - Additional infrastructure complexity
  - Eventual consistency challenges
  - Harder to debug distributed flows
  - Message ordering complexities
  - Broker can become a single point of failure (mitigated with clustering)

**Best for**: East-west communication (service-to-service) when decoupling and asynchronous processing are priorities.

For the remainder of this article, we'll assume asynchronous communication uses messaging.

##### gRPC

Google Remote Procedure Call (gRPC) is a framework using Protocol Buffers for serialization and HTTP/2 for transport. It supports both synchronous and asynchronous communication patterns.

Synchronous unary RPC:

![Sync gRPC](tobeincluded)

Asynchronous streaming:

![Async gRPC](tobeincluded)

**Tradeoffs:**

- **Pros**:
  - High performance with binary serialization
  - Low latency over persistent HTTP/2 connections
  - Strongly typed contracts reduce runtime errors
  - Built-in streaming support (unidirectional and bidirectional)
  - Efficient for microservices communication

- **Cons**:
  - Tighter coupling through shared Protocol Buffer contracts
  - Binary format is not human-readable
  - Steeper learning curve
  - Limited browser support
  - Requires HTTP/2 infrastructure

**Best for**: East-west communication (service-to-service) with low-latency requirements.

For simplicity, we'll exclude gRPC from our saga examples in this article.

#### Coordination: Who's in charge?

The *Commit Esports* team faces a crucial decision: should they use orchestration or choreography for their tournament registration process? The workflow spans multiple services—registration, team validation, payment, and email notifications. Someone (or something) needs to coordinate this dance.

##### Orchestration: The conductor pattern

In orchestration, a central orchestrator service manages the entire transaction lifecycle. Think of it as a conductor directing an orchestra—it knows the score, cues each musician, and handles any mistakes.

Successful registration workflow:

![Successful orchestration](tobeincluded)

Error management with compensating transactions:

![Error orchestration](tobeincluded)

**When to use orchestration:**
- Complex business rules require centralized logic
- You need sophisticated error handling strategies
- Explicit transaction visibility and monitoring matter
- Recovery operations must be carefully sequenced

**Tradeoffs:**
- **Pros**: Clear transaction flow, easier debugging, centralized error handling
- **Cons**: Orchestrator becomes a single point of failure, potential bottleneck, tighter coupling to orchestrator service

##### Choreography: The dance pattern

In choreography, no central coordinator exists—each service knows its role and responds to events from other services. Like dancers in a choreographed performance, each service knows when to act based on what others do.

Successful registration workflow:

![Successful choreography](tobeincluded)

Error management through event propagation:

![Error choreography](tobeincluded)

**When to use choreography:**
- Prioritizing system responsiveness
- Maximizing scalability and throughput
- Fire-and-forget operations are acceptable
- Simple workflows with few participants

**Tradeoffs:**
- **Pros**: No single point of failure, better scalability, lower latency
- **Cons**: Harder to understand complete flow, debugging complexity, risk of cyclic dependencies

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

1. **Prepare phase** (voting): The coordinator asks each participant, "Can you commit?"
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

![XA transactions](tobeincluded)

**The verdict:**

Remember the First Law of Software Architecture: **everything in software architecture is a tradeoff**. While XA transactions have earned a terrible reputation in the microservices world, they may still be appropriate for specific scenarios where strong consistency outweighs availability concerns.

However, their bad reputation is well-deserved. By choosing XA transactions, you're essentially importing one of the monolith's most significant flaws—blocking, coordinated commits—into your distributed system. You've distributed your system's components but retained its most problematic coupling mechanism.

For most modern microservices architectures, sagas provide a more pragmatic path forward.

### The eight saga patterns

The *Commit Esports* CTO stands at the whiteboard, marker in hand. "So we have three dimensions," he says, drawing three axes. "Communication: sync or async. Coordination: orchestration or choreography. Consistency: atomic or eventual. That gives us..." he pauses, calculating, "...eight possible combinations."

The lead architect nods slowly. "Not all of them will be practical, though."

"Exactly," the CTO agrees. "But understanding all eight helps us see *why* some patterns work better than others. Let's explore each one."

What follows is Mark Richards and Neal Ford's saga taxonomy—a systematic exploration of every possible combination. Each pattern has earned a memorable name that captures its essential character.

---

#### Epic Saga

**Characteristics:**
- **Atomic** consistency
- **Synchronous** communication  
- **Orchestration** coordination

![Epic Saga](tobeincluded)

<div align="center">
<em>A long-running, heroic story</em>
</div>

As we discussed earlier, achieving atomicity requires implementing a two-phase commit (2PC) approach. The orchestrator service manages the entire transaction by asking each participant if they're ready to commit (prepare phase), then instructing all participants to either commit or abort based on their responses.

A successful scenario looks like this:

> [!success]- Epic Saga Success
> ![Epic Saga Success](tobeincluded)

A common implementation strategy uses **state management**—each table adds a `state` column tracking the current status of rows involved in the transaction. States might progress from `PENDING` to `COMPLETED`.

But wait... doesn't this flow look familiar?

> [!success]- XA Success
> ![XA Success](tobeincluded)

That's right—this is essentially the same pattern as XA transactions! The failure scenarios also mirror each other:

> [!failure]- Error Handling (Both)
> ![Epic Saga Failure](tobeincluded)
> 
> ![XA Failure](tobeincluded)

> [!warning] The relationship between XA and Sagas
> Sagas are often presented as the alternative to XA transactions. The truth is more nuanced: Epic Sagas and XA are close relatives.
> 
> **The key difference**: Epic Sagas implement two-phase commit at the application level, while XA implements it at the database/message broker level. XA can maintain additional guarantees like consistent secondary indexes. Epic Sagas break the abstraction layer (adding state columns, for example) but gain compatibility with participants that don't support XA protocols.

**When to use XA transactions:**
- Consistency is paramount and you need database-level guarantees (like consistent secondary indexes)
- All participants are XA-compliant

**When to use Epic Sagas:**
- You want to minimize lock duration
- Some participants don't support XA protocols
- You need more control over the coordination logic

**Tradeoffs:**

**Pros:**
- Low logical complexity—the pattern is straightforward to understand
- Strong consistency guarantees

**Cons:**
- **High coupling:**
  - Direct synchronous communication between services
  - Central mediator creates a dependency point
  - Atomic scope spans all participants globally
- **Limited responsiveness and scalability:**
  - Mediator becomes a bottleneck
  - Atomicity requires additional coordination steps
  - Synchronous communication blocks other operations
- **Operational complexity:** Mediator failure impacts the entire system

---

#### Fantasy Fiction Saga

**Characteristics:**
- **Atomic** consistency
- **Asynchronous** communication
- **Orchestration** coordination

![Fantasy Fiction Saga](tobeincluded)

<div align="center">
<em>A complex story that's hard to believe</em>
</div>

We're attempting to achieve atomicity with asynchronous communication—implementing 2PC through a message broker. The logical flow becomes significantly more complex:

> [!success]- Fantasy Fiction Saga Success
> ![Fantasy Fiction Saga Success](tobeincluded)

> [!failure]- Fantasy Fiction Saga Error Handling
> ![Fantasy Fiction Saga Error Handling](tobeincluded)

The fundamental problem with achieving atomicity through non-blocking workflows is that the orchestrator must manage multiple concurrent transactions, each requiring multiple coordination steps.

The asynchronous nature creates a dangerous feedback loop: while responsiveness appears enhanced initially, you're actually allowing more transactions to pile up simultaneously. This increases the orchestrator's load, which leads to more row locks, which slows down subsequent transactions, which causes even more transactions to queue up. The number of possible failure scenarios explodes due to workflow complexity and increased transaction volume, making this pattern extremely challenging to implement reliably.

**Tradeoffs:**

**Pros:**
- Strong consistency guarantees (in theory)

**Cons:**
- **Coupling:** Central mediator creates dependencies
- **Complexity explosion:** Managing distributed atomic transactions asynchronously is extraordinarily difficult—the mediator must coordinate multiple atomic commits simultaneously, causing error-handling complexity to grow exponentially
- **Performance degradation:** Making distributed atomic transactions non-blocking paradoxically worsens performance—it increases pending transaction count, slowing resolution even further

**Reality check:** This pattern is rarely seen in production systems for good reason. The complexity typically outweighs any theoretical benefits.

---

#### Fairy Tale Saga

**Characteristics:**
- **Eventual** consistency
- **Synchronous** communication
- **Orchestration** coordination

![Fairy Tale Saga](tobeincluded)

<div align="center">
<em>An easy story with a pleasant ending</em>
</div>

Let's return to synchronous communication while relaxing the atomicity constraint. This is where sagas start becoming practical.

> [!success]- Fairy Tale Saga Success
> ![Fairy Tale Saga Success](tobeincluded)

> [!failure]- Fairy Tale Saga Error Handling
> ![Fairy Tale Saga Error Handling](tobeincluded)

This is arguably the simplest saga pattern to implement successfully. Error management complexity is elegantly handled by the orchestrator. Synchronous communication provides immediate feedback, enabling a more stateless implementation.

We accept that services may temporarily show inconsistent data by scoping transactions at the service level. However, the synchronous nature ensures we can correct inconsistencies as quickly as possible using either **state management** (tracking transaction progress) or **compensating transactions** (undoing completed steps).

**Tradeoffs:**

**Pros:**
- **Simplest saga implementation:**
  - Error handling simplified through central orchestrator
  - No distributed atomic transactions to coordinate
  - Synchronous communication helps keep transaction state manageable
- **Easily scalable:** Eventual consistency and synchronous patterns scale well together

**Cons:**
- **Coupling:**
  - Synchronous communication creates service dependencies
  - Central mediator required
- **Eventual consistency:** Temporary inconsistencies are visible to users

**Practical note:** This is often the first saga pattern teams implement when migrating from monoliths. It provides a good balance of simplicity and capability.

---

#### Parallel Saga

**Characteristics:**
- **Eventual** consistency
- **Asynchronous** communication
- **Orchestration** coordination

![Parallel Saga](tobeincluded)

<div align="center">
<em>Reading multiple stories at the same time</em>
</div>

The Fairy Tale Saga works well—why not decouple services further by switching to asynchronous communication?

> [!success]- Parallel Saga Success
> ![Parallel Saga Success](tobeincluded)

> [!failure]- Parallel Saga Error Handling
> ![Parallel Saga Error Handling](tobeincluded)

Error management flows become more complex, but this saga achieves impressive responsiveness. You can immediately confirm to users that their request is being orchestrated (returning a "pending" status) and notify them later when processing completes. The asynchronous nature allows the orchestrator to contact all participants without blocking, potentially making the overall process faster.

**Tradeoffs:**

**Pros:**
- **Lower coupling:**
  - Message broker decouples services from direct dependencies
  - Transactions scoped at the service level
- **Highly responsive:**
  - Fire-and-forget nature enables fast user feedback
  - No global atomicity coordination required

**Cons:**
- **Error handling complexity:** Asynchronous nature makes failure scenarios harder to manage
- **Eventual consistency:** Temporary inconsistencies are visible

**Practical note:** This pattern excels when user experience demands fast response times, and you can afford to handle compensation asynchronously.

---

#### Phone Tag Saga

**Characteristics:**
- **Atomic** consistency
- **Synchronous** communication
- **Choreography** coordination

![Phone Tag Saga](tobeincluded)

<div align="center">
<em>A story like the game of phone tag</em>
</div>

Can we achieve atomicity without an orchestrator? Let's try:

> [!success]- Phone Tag Saga Success
> ![Phone Tag Saga Success](tobeincluded)

> [!failure]- Phone Tag Saga Error Handling
> ![Phone Tag Saga Error Handling](tobeincluded)

This pattern resembles an Epic Saga with many back-and-forth calls. Someone still needs to coordinate the transaction to ensure everyone agrees. So why would anyone implement this strategy?

The answer: **fault tolerance**. If the coordinating service fails, other services can elect a new coordinator to complete the transaction using **consensus algorithms** (like Raft or Paxos). You pay for additional complexity but gain resilience against coordinator failure.

**Tradeoffs:**

**Pros:**
- Strong consistency guarantees
- Better fault tolerance than centralized orchestration

**Cons:**
- **Hidden complexity:** Usually requires a "hidden" coordinator role, creating coupling despite the choreography appearance
- **Distributed coordination burden:** All services share responsibility for ensuring global atomicity, significantly increasing implementation complexity

**Reality check:** This pattern is rarely implemented outside of specialized distributed databases and coordination systems. The complexity typically isn't justified for business applications.

---

#### Horror Story Saga

**Characteristics:**
- **Atomic** consistency
- **Asynchronous** communication
- **Choreography** coordination

![Horror Story Saga](tobeincluded)

<div align="center">
<em>The scariest story you will ever encounter</em>
</div>

Achieving atomicity with asynchronous communication is difficult (Fantasy Fiction Saga). Achieving it without an orchestrator is also difficult (Phone Tag Saga). But what if we combine both challenges?

Meet the Horror Story Saga:

> [!success]- Horror Story Saga Success
> ![Horror Story Saga Success](tobeincluded)

> [!failure]- Horror Story Saga Error Handling
> ![Horror Story Saga Error Handling](tobeincluded)

The CAP theorem tells us: in distributed systems facing network partitions, choose between Consistency and Availability. You can't have both. The Horror Story Saga tries to have both anyway.

The result? A system with countless failure scenarios and nearly impossible error management. Even the success case is extraordinarily difficult to implement. You're asking all participants to communicate through messaging, knowing as little as possible about each other, while somehow achieving atomicity without a coordinator. 

In practice, this often results in tightly coupled code disguised as choreography—you're just hiding the complexity, not eliminating it. You cannot avoid the necessary coordination entropy; fighting against it makes things worse. (See [my entropy article](https://dsalathe.github.io/blog/#/blog/2) if this topic interests you.)

**Tradeoffs:**

**Pros:**
- Strong consistency guarantees (in theory)

**Cons:**
- **Extraordinarily difficult to implement:**
  - All services must track global transaction state
  - But asynchronous nature tries to decouple that tracking
  - Multiple transactions can be managed concurrently, potentially out of order
  - The multiplicity and complexity of error conditions are overwhelming
- **Terrible responsiveness:** Despite async communication, atomic requirements create bottlenecks

**Reality check:** Don't implement this pattern. If you think you need it, reconsider your architecture.

---

#### Time Travel Saga

**Characteristics:**
- **Eventual** consistency
- **Synchronous** communication
- **Choreography** coordination

![Time Travel Saga](tobeincluded)

<div align="center">
<em>A story that moves through time</em>
</div>

What happens when we take the Phone Tag Saga but relax the atomicity constraint?

> [!success]- Time Travel Saga Success
> ![Time Travel Saga Success](tobeincluded)

> [!failure]- Time Travel Saga Error Handling
> ![Time Travel Saga Error Handling](tobeincluded)

This is the simplest choreography pattern to reason about. Error management becomes easier because the previous service in the chain can immediately handle failures. Each service doesn't need deep knowledge of other services thanks to eventual consistency.

We're building a genuinely high-availability system. But can we make it even more available, loosely coupled, and fault-tolerant?

Yes. Meet the Anthology Saga.

---

#### Anthology Saga

**Characteristics:**
- **Eventual** consistency
- **Asynchronous** communication
- **Choreography** coordination

![Anthology Saga](tobeincluded)

<div align="center">
<em>A loosely associated group of short stories</em>
</div>

The most decoupled architecture possible:

> [!success]- Anthology Saga Success
> ![Anthology Saga Success](tobeincluded)

> [!failure]- Anthology Saga Error Handling
> ![Anthology Saga Error Handling](tobeincluded)

This pattern achieves true independence between services. Each service publishes events describing what happened. Other services subscribe to relevant events and react accordingly. No service needs to know who's listening or what they'll do with the information.

The cost? Error management flows become more complex. You need comprehensive monitoring and observability to understand what's happening across the system.

This is the modern ideal for large-scale, high-agility systems. It scales best when you need multiple teams working independently, handling heavy user loads, and evolving rapidly.

**Tradeoffs:**

**Pros:**
- **Highly decoupled:**
  - Asynchronous messaging decouples producers from consumers
  - Transactions scoped at the service level
  - No central mediators
- **Highly responsive:**
  - No bottlenecks from central coordinators
  - Eventual consistency and async nature enable fire-and-forget message patterns
- **Highly scalable:** Same properties that enable responsiveness also enable horizontal scaling

**Cons:**
- **Error handling complexity:** Without a central orchestrator, understanding and fixing failures requires sophisticated monitoring
- **Eventual consistency:** Users may see temporary inconsistencies

**Practical note:** This is the pattern that companies like Netflix, Amazon, and Uber use at scale. It requires mature engineering practices but delivers exceptional scalability and agility.

---

### Choosing your saga pattern

The *Commit Esports* team stares at the whiteboard, now covered with eight different patterns.

"*So which one should we use?*" asks a developer.

The architect smiles. "*That's the wrong question. The right question is: which ones should we use, and where?*"

Different parts of your system have different requirements:

**For critical financial transactions** (payments, tournament prizes):
- Start with **Fairy Tale Saga** (eventual/sync/orchestration) for simplicity
- Consider **Epic Saga** (atomic/sync/orchestration) if you need strong consistency and can tolerate the coupling

**For user registration and notifications**:
- Use **Parallel Saga** (eventual/async/orchestration) for good responsiveness
- Upgrade to **Anthology Saga** (eventual/async/choreography) as your system matures

**For high-volume, non-critical operations** (analytics, recommendations):
- Go straight to **Anthology Saga** (eventual/async/choreography) for maximum scalability

**Patterns to avoid in most cases:**
- **Fantasy Fiction Saga** (atomic/async/orchestration): Too complex for the benefits
- **Phone Tag Saga** (atomic/sync/choreography): Complexity without clear wins
- **Horror Story Saga** (atomic/async/choreography): Just don't

The key insight? You don't choose *one* saga pattern for your entire system. You choose the right pattern for each use case, understanding the tradeoffs each brings.

### Wrap up

We've journeyed from monolithic databases to microservices data ownership. We've explored access patterns that balance consistency with autonomy. And we've discovered eight saga patterns that coordinate transactions across service boundaries.

The *Commit Esports* team now has the tools they need. They understand that:

1. **Data ownership matters**: Clear ownership prevents conflicts and enables independent scaling
2. **Access patterns are contextual**: Different use cases demand different strategies
3. **Sagas aren't one-size-fits-all**: The right saga pattern depends on your specific requirements
4. **Tradeoffs are inevitable**: Every architectural decision trades one property for another

Most importantly, they've learned that distributed systems aren't about finding the "perfect" solution. They're about making informed tradeoffs that align with your business needs, your team's capabilities, and your system's constraints.

The hard parts of software architecture? They're hard because they force you to make difficult choices. But armed with these patterns and principles, you're equipped to make those choices wisely.

Your distributed system won't be perfect. But with careful thought and deliberate design, it will be *good enough*—and that's what matters.