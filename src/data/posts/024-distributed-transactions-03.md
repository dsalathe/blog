---
id: 24
title: The Eight Saga Patterns - A Complete Taxonomy
description: Explore all eight saga patterns from Mark Richards and Neal Ford's taxonomy. Learn when to use Epic, Fairy Tale, Parallel, and Anthology sagas—and which patterns to avoid. Includes concrete tradeoffs, implementation guidance, and decision frameworks for choosing the right pattern for your use case.
publishedDate: 9999-12-31
image: eightSagas.png
audience:
  - Software Architects
  - Backend Engineers
keywords:
  - saga patterns
  - saga taxonomy
  - epic saga
  - fairy tale saga
  - parallel saga
  - anthology saga
  - orchestration patterns
  - choreography patterns
  - distributed transactions
  - microservices patterns
  - transaction coordination
  - compensating transactions
previous: 23
---

## Prelude

This article is heavily based on two fantastic books:

- [Software Architecture, the hard parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/), by Neal Ford, Mark Richards, Pramod Sadalage and Zhamak Dehghani
- [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/), by Martin Kleppmann

Both books tackle distributed transactions brilliantly—the former through an engineering lens, the latter from a more academic perspective. What makes this article unique is how we'll bridge these two worlds, building rock-solid fundamentals that you can actually apply to real systems.

## Recap: The saga fundamentals

In the [previous article](https://dsalathe.github.io/blog/#/blog/22), we explored the theoretical foundations of distributed transactions. We dissected ACID properties with newfound nuance, understanding that atomicity, consistency, isolation, and durability each play distinct roles. We introduced BASE as an alternative philosophy for distributed systems. We examined XA transactions and their 2PC protocol, understanding both their power and their significant limitations.

Most importantly, we established that sagas operate across three dimensions:

- **Communication**: Synchronous (REST-like) vs. Asynchronous (messaging-based)
- **Coordination**: Orchestration (centralized control) vs. Choreography (distributed coordination)
- **Consistency**: Atomic (all-or-nothing) vs. Eventual (temporarily inconsistent but eventually correct)

With 2 × 2 × 2 combinations, we have eight possible saga patterns. But which ones actually work in practice? Which ones scale? Which ones should you avoid at all costs?

Let's find out.

### The eight saga patterns

The *Commit Esports* CTO stands at the whiteboard, marker in hand. "So we have three dimensions," he says, drawing three axes. "Communication: sync or async. Coordination: orchestration or choreography. Consistency: atomic or eventual. That gives us..." he pauses, calculating, "...eight possible combinations."

The lead architect nods slowly. "Not all of them will be practical, though."

"Exactly," the CTO agrees. "But understanding all eight helps us see *why* some patterns work better than others. Let's explore each one."

What follows is Mark Richards and Neal Ford's saga taxonomy—a systematic exploration of every possible combination. Each pattern has earned a memorable name that captures its essential character.

> [!Note]- Conventions in this article
>
> To keep this exploration concrete and focused, we make several simplifying assumptions:
> 
> 1. **Synchronous communication** uses REST-style HTTP endpoints.
> 2. **Asynchronous communication** uses messaging with a message broker (e.g., RabbitMQ, Kafka).
> 3. **No gRPC**: We exclude gRPC from our examples for simplicity, though it could be used in practice.
> 4. **Consistency definitions**: While these eight sagas draw heavily from Mark Richards and Neal Ford's taxonomy, we define the consistency dimension more rigorously based on Martin Kleppmann's treatment:
>    - **Atomic**: All participants agree to commit the transaction or all agree to abort it (ACID-style atomicity).
>    - **Eventual**: Individual services may temporarily show partial transaction results that could later be compensated or rolled back.
> 5. **Atomicity implementation**: Multiple strategies exist for achieving atomicity in distributed systems (two-phase commit, three-phase commit, consensus algorithms, Google TrueTime). We'll focus on the most straightforward: two-phase commit (2PC).
>
> These conventions trade some real-world complexity for clarity. In production systems, you'll encounter hybrid approaches and additional patterns beyond what we cover here.


---

#### Epic Saga

![Epic Saga](${baseUrl}blog-images/distributed-transactions/sagaEpic.png)

<div align="center">
<em>A long-running, heroic story</em>
</div>

As we discussed earlier, achieving atomicity requires implementing a two-phase commit (2PC) approach. The orchestrator service manages the entire transaction by asking each participant if they're ready to commit (prepare phase), then instructing all participants to either commit or abort based on their responses.

A successful scenario looks like this:

> [!success]- Epic Saga Success
> ![Epic Saga Success](${baseUrl}blog-images/distributed-transactions/sagaEpicSuccess.png)

A common implementation strategy uses **state management**—each table adds a `state` column tracking the current status of rows involved in the transaction. States might progress from `PENDING` to `COMPLETED`.

But wait... doesn't this flow look familiar?

> [!success]- XA Success
> ![XA Success](${baseUrl}blog-images/distributed-transactions/xaSuccess.png)

That's right—this is essentially the same pattern as XA transactions, as seen in previous post! The failure scenarios also mirror each other:

> [!failure]- Error Handling (Both)
> ![Epic Saga Failure](${baseUrl}blog-images/distributed-transactions/sagaEpicFailure.png)
> 
> ![XA Failure](${baseUrl}blog-images/distributed-transactions/xaFailure.png)

> [!warning] The relationship between XA and Sagas
> Sagas are often presented as the alternative to XA transactions. The truth is more nuanced: Epic Sagas and XA are close relatives.
> 
> **The key difference**: Epic Sagas implement two-phase commit at the application level, while XA implements it at the database/message broker level. XA can maintain additional guarantees like consistent secondary indexes. Epic Sagas break the abstraction layer (adding state columns, for example) but gain compatibility with participants that don't support XA protocols.

> [!tip]- Tradeoffs
> 
> **Pros:**
> - Low logical complexity—the pattern is straightforward to understand
> - Strong consistency guarantees
> 
> **Cons:**
> - **High coupling:**
>   - Direct synchronous communication between services
>   - Central mediator creates a dependency point
>   - Atomic scope spans all participants globally
> - **Limited responsiveness and scalability:**
>   - Mediator becomes a bottleneck
>   - Atomicity requires additional coordination steps
>   - Synchronous communication blocks other operations
> - **Operational complexity:** Mediator failure impacts the entire system

> [!todo] Practical note
> **When to use XA transactions:**
> - Consistency is paramount and you need database-level guarantees (like consistent secondary indexes)
> - All participants are XA-compliant
> 
> **When to use Epic Sagas:**
> - You want to minimize lock duration
> - Some participants don't support XA protocols
> - You need more control over the coordination logic

---

#### Fantasy Fiction Saga

![Fantasy Fiction Saga](${baseUrl}blog-images/distributed-transactions/sagaFantasyFiction.png)

<div align="center">
<em>A complex story that's hard to believe</em>
</div>

We're attempting to achieve atomicity with asynchronous communication—implementing 2PC through a message broker. The logical flow becomes significantly more complex:

> [!success]- Fantasy Fiction Saga Success
> ![Fantasy Fiction Saga Success](${baseUrl}blog-images/distributed-transactions/sagaFantasyFictionSuccess.png)

> [!failure]- Fantasy Fiction Saga Error Handling
> ![Fantasy Fiction Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaFantasyFictionFailure.png)

The fundamental problem with achieving atomicity through non-blocking workflows is that the orchestrator must manage multiple concurrent transactions, each requiring multiple coordination steps.

The asynchronous nature creates a dangerous feedback loop: while responsiveness appears enhanced initially, you're actually allowing more transactions to pile up simultaneously. This increases the orchestrator's load, which leads to more row locks, which slows down subsequent transactions, which causes even more transactions to queue up. The number of possible failure scenarios explodes due to workflow complexity and increased transaction volume, making this pattern extremely challenging to implement reliably.

> [!tip]- Tradeoffs
> 
> **Pros:**
> - Strong consistency guarantees (in theory)
> 
> **Cons:**
> - **Coupling:** Central mediator creates dependencies
> - **Complexity explosion:** Managing distributed atomic transactions asynchronously is extraordinarily difficult—the mediator must coordinate multiple atomic commits simultaneously, causing error-handling complexity to grow exponentially
> - **Performance degradation:** Making distributed atomic transactions non-blocking paradoxically worsens performance—it increases pending transaction count, slowing resolution even further

> [!danger] Reality check
> This pattern is rarely seen in production systems for good reason. The complexity typically outweighs any theoretical benefits.

---

#### Fairy Tale Saga

![Fairy Tale Saga](${baseUrl}blog-images/distributed-transactions/sagaFairyTale.png)

<div align="center">
<em>An easy story with a pleasant ending</em>
</div>

Let's return to synchronous communication while relaxing the atomicity constraint. This is where sagas start becoming practical.

> [!success]- Fairy Tale Saga Success
> ![Fairy Tale Saga Success](${baseUrl}blog-images/distributed-transactions/sagaFairyTaleSuccess.png)

> [!failure]- Fairy Tale Saga Error Handling
> ![Fairy Tale Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaFairyTaleFailure.png)

This is arguably the simplest saga pattern to implement successfully. Error management complexity is elegantly handled by the orchestrator. Synchronous communication provides immediate feedback, enabling a more stateless implementation.

We accept that services may temporarily show inconsistent data by scoping transactions at the service level. However, the synchronous nature ensures we can correct inconsistencies as quickly as possible using either **state management** (tracking transaction progress) or **compensating transactions** (undoing completed steps).

> [!tip]- Tradeoffs
> 
> **Pros:**
> - **Simplest saga implementation:**
>   - Error handling simplified through central orchestrator
>   - No distributed atomic transactions to coordinate
>   - Synchronous communication helps keep transaction state manageable
> - **Easily scalable:** Eventual consistency and synchronous patterns scale well together
> 
> **Cons:**
> - **Coupling:**
>   - Synchronous communication creates service dependencies
>   - Central mediator required
> - **Eventual consistency:** Temporary inconsistencies are visible to users

> [!todo] Practical note
> This is often the first saga pattern teams implement when migrating from monoliths. It provides a good balance of simplicity and capability.

---

#### Parallel Saga

![Parallel Saga](${baseUrl}blog-images/distributed-transactions/sagaParallel.png)

<div align="center">
<em>Reading multiple stories at the same time</em>
</div>

The Fairy Tale Saga works well—why not decouple services further by switching to asynchronous communication?

> [!success]- Parallel Saga Success
> Response after all services confirmed the transaction:
> 
> ![Parallel Saga Success](${baseUrl}blog-images/distributed-transactions/sagaParallelSuccess1.png)
> 
> Response immediately and confirmation later:
> ![Parallel Saga Success Immediate](${baseUrl}blog-images/distributed-transactions/sagaParallelSuccess2.png)

> [!failure]- Parallel Saga Error Handling
> ![Parallel Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaParallelFailure.png)

Error management flows become more complex, but this saga achieves impressive responsiveness. You can immediately confirm to users that their request is being orchestrated (returning a "pending" status) and notify them later when processing completes. The asynchronous nature allows the orchestrator to contact all participants without blocking, potentially making the overall process faster.

> [!tip]- Tradeoffs
> 
> **Pros:**
> - **Lower coupling:**
>   - Message broker decouples services from direct dependencies
>   - Transactions scoped at the service level
> - **Highly responsive:**
>   - Fire-and-forget nature enables fast user feedback
>   - No global atomicity coordination required
> 
> **Cons:**
> - **Error handling complexity:** Asynchronous nature makes failure scenarios harder to manage
> - **Eventual consistency:** Temporary inconsistencies are visible

> [!todo] Practical note
> This pattern excels when user experience demands fast response times, and you can afford to handle compensation asynchronously.

---

#### Phone Tag Saga

![Phone Tag Saga](${baseUrl}blog-images/distributed-transactions/sagaPhoneTag.png)

<div align="center">
<em>A story like the game of phone tag</em>
</div>

Can we achieve atomicity without an orchestrator? Let's try:

> [!success]- Phone Tag Saga Success
> ![Phone Tag Saga Success](${baseUrl}blog-images/distributed-transactions/sagaPhoneTagSuccess.png)

> [!failure]- Phone Tag Saga Error Handling
> ![Phone Tag Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaPhoneTagFailure.png)

This pattern resembles an Epic Saga with many back-and-forth calls. Someone still needs to coordinate the transaction to ensure everyone agrees. So why would anyone implement this strategy?

The answer: **fault tolerance**. If the coordinating service fails, other services can elect a new coordinator to complete the transaction using **consensus algorithms** (like Raft or Paxos). You pay for additional complexity but gain resilience against coordinator failure.

> [!tip]- Tradeoffs
> 
> **Pros:**
> - Strong consistency guarantees
> - Better fault tolerance than centralized orchestration
> 
> **Cons:**
> - **Hidden complexity:** Usually requires a "hidden" coordinator role, creating coupling despite the choreography appearance
> - **Distributed coordination burden:** All services share responsibility for ensuring global atomicity, significantly increasing implementation complexity

> [!danger] Reality check
> This pattern is rarely implemented outside of specialized distributed databases and coordination systems. The complexity typically isn't justified for business applications.

---

#### Horror Story Saga

![Horror Story Saga](${baseUrl}blog-images/distributed-transactions/sagaHorrorStory.png)

<div align="center">
<em>The scariest story you will ever encounter</em>
</div>

Achieving atomicity with asynchronous communication is difficult (Fantasy Fiction Saga). Achieving it without an orchestrator is also difficult (Phone Tag Saga). But what if we combine both challenges?

Meet the Horror Story Saga:

> [!success]- Horror Story Saga Success
> ![Horror Story Saga Success](${baseUrl}blog-images/distributed-transactions/sagaHorrorStorySuccess.png)

> [!failure]- Horror Story Saga Error Handling
> ![Horror Story Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaHorrorStoryFailure.png)

The CAP theorem tells us: in distributed systems facing network partitions, choose between Consistency and Availability. You can't have both. The Horror Story Saga tries to have both anyway.

The result? A system with countless failure scenarios and nearly impossible error management. Even the success case is extraordinarily difficult to implement. You're asking all participants to communicate through messaging, knowing as little as possible about each other, while somehow achieving atomicity without a coordinator. 

In practice, this often results in tightly coupled code disguised as choreography—you're just hiding the complexity, not eliminating it. You cannot avoid the necessary coordination entropy; fighting against it makes things worse. (See [my entropy article](https://dsalathe.github.io/blog/#/blog/2) if this topic interests you.)

> [!tip]- Tradeoffs
> 
> **Pros:**
> - Strong consistency guarantees (in theory)
> 
> **Cons:**
> - **Extraordinarily difficult to implement:**
>   - All services must track global transaction state
>   - But asynchronous nature tries to decouple that tracking
>   - Multiple transactions can be managed concurrently, potentially out of order
>   - The multiplicity and complexity of error conditions are overwhelming
> - **Terrible responsiveness:** Despite async communication, atomic requirements create bottlenecks

> [!danger] Reality check
> Don't implement this pattern. If you think you need it, reconsider your architecture.

---

#### Time Travel Saga

![Time Travel Saga](${baseUrl}blog-images/distributed-transactions/sagaTimeTravel.png)

<div align="center">
<em>A story that moves through time</em>
</div>

What happens when we take the Phone Tag Saga but relax the atomicity constraint?

> [!success]- Time Travel Saga Success
> ![Time Travel Saga Success](${baseUrl}blog-images/distributed-transactions/sagaTimeTravelSuccess.png)

> [!failure]- Time Travel Saga Error Handling
> ![Time Travel Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaTimeTravelFailure.png)

This is the simplest choreography pattern to reason about. Error management becomes easier because the previous service in the chain can immediately handle failures. Each service doesn't need deep knowledge of other services thanks to eventual consistency.

We're building a genuinely high-availability system. But can we make it even more available, loosely coupled, and fault-tolerant?

Yes. Meet the Anthology Saga.

---

#### Anthology Saga

![Anthology Saga](${baseUrl}blog-images/distributed-transactions/sagaAnthology.png)

<div align="center">
<em>A loosely associated group of short stories</em>
</div>

The most decoupled architecture possible:

> [!success]- Anthology Saga Success
> ![Anthology Saga Success](${baseUrl}blog-images/distributed-transactions/sagaAnthologySuccess.png)

> [!failure]- Anthology Saga Error Handling
> ![Anthology Saga Error Handling](${baseUrl}blog-images/distributed-transactions/sagaAnthologyFailure.png)

This pattern achieves true independence between services. Each service publishes events describing what happened. Other services subscribe to relevant events and react accordingly. No service needs to know who's listening or what they'll do with the information.

The cost? Error management flows become more complex. You need comprehensive monitoring and observability to understand what's happening across the system.

This is the modern ideal for large-scale, high-agility systems. It scales best when you need multiple teams working independently, handling heavy user loads, and evolving rapidly.

> [!tip]- Tradeoffs
> 
> **Pros:**
> - **Highly decoupled:**
>   - Asynchronous messaging decouples producers from consumers
>   - Transactions scoped at the service level
>   - No central mediators
> - **Highly responsive:**
>   - No bottlenecks from central coordinators
>   - Eventual consistency and async nature enable fire-and-forget message patterns
> - **Highly scalable:** Same properties that enable responsiveness also enable horizontal scaling
> 
> **Cons:**
> - **Error handling complexity:** Without a central orchestrator, understanding and fixing failures requires sophisticated monitoring
> - **Eventual consistency:** Users may see temporary inconsistencies

> [!todo] Practical note
> This is the pattern that companies like Netflix, Amazon, and Uber use at scale. It requires mature engineering practices but delivers exceptional scalability and agility.

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