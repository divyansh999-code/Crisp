<div align="center">

<img src="assets/icon128.png" width="80" alt="Crisp Logo" />

# ✦ Crisp

**A Chrome extension that optimizes your Claude prompts before you send them.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://github.com/divyansh999-code/crisp)
[![Groq](https://img.shields.io/badge/Powered%20by-Groq-orange?style=flat-square)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Also%20supports-Gemini-blue?style=flat-square)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

<!-- Add your demo GIF here -->
<!-- ![Crisp Demo](assets/demo.gif) -->

</div>

---

## The problem

Claude's free tier burns output tokens fast. Most people write prompts like this:

> *"I was wondering if you could please help me understand what the difference is between REST and GraphQL APIs, and also could you kindly explain when I should use one over the other, and maybe give some examples too if that's not too much trouble"*

That's 681 tokens of response. Padded with filler, repeated asks, and politeness Claude doesn't need.

## What Crisp does

Crisp sits next to Claude's send button. One click — it rewrites your prompt before it hits Claude. No bloat, same meaning.

The same prompt above becomes:

> *"What's the difference between REST and GraphQL APIs? When to use each?*
> *Be concise. No filler. Answer only what is asked."*

**331 tokens. 51% less output. Zero information lost.**

The real saving isn't just shorter prompts — it's the `Be concise. No filler.` instruction appended to every rewrite that forces Claude's responses to be tighter too.

---

## Screenshots

<!-- Add screenshots here -->
| Rewrite Modal | Settings | In-page Button |
|:---:|:---:|:---:|
| ![Modal](assets/modal.png) | ![Settings](assets/settings.png) | ![Button](assets/button.png) |

---

## Features

- **✦ One-click optimization** — Crisp button sits right next to Claude's send button
- **Smart classification** — detects casual conversation and passes it through untouched
- **Side-by-side diff** — see original vs rewritten before you commit
- **Token savings counter** — know exactly how much you're cutting
- **Groq + Gemini support** — use whichever free API key you have
- **Local key storage** — your API key never leaves your browser

---

## Install

> Chrome Web Store listing coming soon. For now, install manually:

1. Clone this repo
```bash
git clone https://github.com/divyansh999-code/crisp.git
```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer mode** (top right toggle)

4. Click **Load unpacked** → select the cloned folder

5. Open [claude.ai](https://claude.ai) — you'll see the **✦ Crisp** button next to send

---

## Setup

1. Click the Crisp extension icon in your toolbar
2. Click **Open Settings**
3. Choose your model — **Groq** (free at [console.groq.com](https://console.groq.com)) or **Gemini** (free at [aistudio.google.com](https://aistudio.google.com))
4. Paste your API key → **Save Settings**

That's it.

---

## How it works

```
You type a prompt in Claude
        ↓
Click ✦ Crisp
        ↓
Crisp sends your prompt to Groq/Gemini with a rewriting system prompt
        ↓
Modal shows: Original ──→ Rewritten + tokens saved
        ↓
"Use this" replaces your input  |  "Keep original" does nothing
        ↓
You send to Claude as normal
```

Crisp never intercepts your Claude conversations. It only touches the text in the input box — and only when you click it.

---

## Token savings — real numbers

Tested on the same prompt, with and without Crisp:

| Prompt type | Without Crisp | With Crisp | Saved |
|---|---|---|---|
| Padded technical ask | 681 tokens | 331 tokens | **~51%** |
| Verbose multi-part question | 420 tokens | 210 tokens | **~50%** |
| Casual venting message | — | unchanged | — |

*Output token savings vary. The `Be concise.` instruction appended to every rewrite consistently reduces Claude's response length on top of this.*

---

## The smart part

Crisp doesn't blindly rewrite everything. It classifies first:

**Social / casual / emotional input** → returned exactly as typed. No changes.

> *"ugh i'm so tired of everything nothing is working out"* → untouched ✓

**Task / question / request** → optimized. Filler removed. Meaning preserved.

> *"I was wondering if you could explain transformers..."* → *"Explain transformers. Simple terms."* ✓

---

## Stack

- Vanilla JS — no frameworks, no build step
- Chrome Extension Manifest V3
- Groq API (`llama-3.3-70b-versatile`)
- Gemini API (`gemini-2.0-flash`)

---

## Built by

**Divyansh Khandal** — second-year AI & Data Science student, MBM Engineering College, Jodhpur.
SIH 2025 National Finalist. Building solo.

[GitHub](https://github.com/divyansh999-code) · [LinkedIn](https://linkedin.com/in/divyansh-khandal-5b8b8b32b)

---

<div align="center">

*Crisp is not affiliated with Anthropic, Groq, or Google.*

</div>
