---
id: 23
title: Distributed Transactions - ACID meaning and Sagas
description: TODO
publishedDate: 2025-10-23
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

## What's in it for you

TODO redo this:

Distributed transactions are hard. Really hard.

Meet *Commit Esports*, our fictive company that's about to learn this lesson the hard way. They built a monolithic application that worked beautifully. Business was booming. Life was good. 

Then came the irony: they became *too* successful.

Their system started buckling under its own weight. Complexity spiraled out of control. User traffic exploded. And now? They're staring down the barrel of a complete system collapse—victims of their own success.

Let's help them survive.

