const e=`---
id: 3
title: The 5 Armies of LLMs - A Quick Recap of the AI Landscape
description: A comprehensive breakdown of the current state of AI, comparing major LLM players to The Hobbit's five armies
publishedDate: 2025-02-21
image: llmwar2025.jpg
keywords:
  - AI
  - LLM
  - ChatGPT
  - Claude
  - Gemini
  - Grok
  - Deepseek
---

It feels like a new LLM is dropping every week, so here's a short breakdown of the current state of AI, using The Hobbit's five armies as a fitting analogy:

## <i class="fa-solid fa-gem"></i> ChatGPT – The Dwarves
GPT-4o (and GPT-4 Turbo for free users) leads the pack in versatility. Great for writing, image generation, and general tasks. OpenAI is trying to move for-profit and has pricing on the higher side, especially with the $200/month Pro plan for their upcoming O1 deep-thinking model.

## <i class="fa-solid fa-leaf"></i> Claude Sonnet – The Elves
Sophisticated, refined, and my go-to for coding. I appreciate how Claude acknowledges uncertainty rather than pretending to know everything. Today, they launched Sonnet 3.7, claiming they didn't overly optimize for the usual math benchmarks, looking forward to testing it.

## <i class="fa-solid fa-feather-pointed"></i> Deepseek – The Eagles
A beacon of hope for open-source AI, proving that smaller players can compete. However, their official chat is unstable, and it sometimes hallucinates with confidence. Still, a promising challenger, but definitively not recommended for production purposes yet, unless you self-host it and can run 25 Nvidia A100 GPUs if you want the full-size model.

## <i class="fa-solid fa-shield-halved"></i> Gemini – The Men
No magical tricks, but solid and reliable. Gemini 2.0 Pro is fast, cheap, and efficient—possibly the most energy-efficient model in its category, even compared to DeepSeek. A strong all-rounder.

## <i class="fa-solid fa-skull"></i> Grok – The Goblins
Unexpectedly dominant in math benchmarks, Grok is the wild card. xAI seems to prioritize free speech, making it less filtered than competitors. That can be a plus—or a minus—depending on your believes in (total) free speech. It has a bold (borderline arrogant) personality, which works for some use cases but not all. I might consider it for coding, but writing articles only if you want a cocky tone.

## Capabilities Comparison

Based on my experience, I would rate the 5 LLMs that way:

| LLM | Coding | Writing Articles | Image Generation | Miscellaneous |
|:-----:|:---------:|:----------------:|:----------------:|:---------------:|
| ChatGPT | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Claude | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ |
| DeepSeek | ⭐⭐⭐ | ⭐⭐ | ❌ | ⭐⭐ |
| Gemini | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Grok | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## Personal Take
I use Claude for coding but considering Grok. I'm excited to try Gemini for building agents for their cheap token cost. I like ChatGPT for writing articles or generating images, but Grok generates good images too. I'm not considering DeepSeek for the moment, even though I strongly believe in open source, but their platform is just too unstable.

## Bonus: LLM Self-Perception
I asked all LLMs to assign themselves to an army:

| LLM | Men | Elves | Dwarves | Eagles | Goblins |
|:-----:|:--------:|:-------:|:--------:|:--------:|
| Claude | ChatGPT | **Claude** | DeepSeek | Gemini | Grok |
| Gemini | ChatGPT | **Gemini** | Claude | DeepSeek | Grok |
| ChatGPT | Gemini | Claude | **ChatGPT** | DeepSeek | Grok |
| Grok | ChatGPT | Claude | Gemini | **Grok** | DeepSeek |
| DeepSeek | ChatGPT | Claude | Gemini | **DeepSeek** | Grok |

In short:
- Claude believes to be the elves and Grok the goblins
- Gemini believes to be the elves and Grok the goblins
- OpenAI believes to be the dwarves and Grok the goblins
- Grok believes to be the eagles and DeepSeek the goblins
- DeepSeek believes to be the eagles and Grok the goblins

I also keep an eye on Perplexity and the groq (with a q) platform that aims to provide the fastest inference platform and provide open source models such as Mistral, DeepSeek or llama 3.

The AI race is evolving fast—what's your go-to model these days? 🚀`;export{e as default};
