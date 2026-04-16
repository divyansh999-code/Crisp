<div align="center">

<img width="128" height="128" alt="Crisp Logo" src="https://github.com/user-attachments/assets/b4ef3d36-fd34-4b97-9b86-63c537a8124c" />

# ✦ Crisp

**A Chrome extension that optimizes your Claude prompts before you send them.**

<br/>

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/divyansh999-code/crisp)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-F55036?style=for-the-badge)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.0--flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![MIT License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-A855F7?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3)

<br/>

<!-- ![Crisp Demo](assets/demo.gif) -->

</div>

---

## The problem

Claude's free tier limits both **input and output tokens**. Most people write prompts like this:

> *"I was wondering if you could please help me understand what the difference is between REST and GraphQL APIs, and also could you kindly explain when I should use one over the other, and maybe give some examples too if that's not too much trouble"*

That prompt is bloated with filler words Claude doesn't need — which means more input tokens consumed, and a longer, preamble-heavy response on the other end burning your output quota too.

## What Crisp does

Crisp sits next to Claude's send button. One click — it rewrites your prompt before it hits Claude. No bloat, same meaning.

The same prompt above becomes:

> *"What's the difference between REST and GraphQL APIs? When to use each?*
> *Be concise. No filler. Answer only what is asked."*

**331 tokens of response vs 681. 51% reduction. Zero information lost.**

Shorter prompt in → fewer input tokens consumed. Tighter instruction appended → shorter response out. Both sides of your quota, covered.

---

## Screenshots

| Rewrite Modal | Settings | In-page Button |
|:---:|:---:|:---:|
| <img width="1159" height="572" alt="Modal" src="https://github.com/user-attachments/assets/4f88b5b5-ac19-425b-8870-78e0087e88e5" /> | <img width="877" height="905" alt="Settings" src="https://github.com/user-attachments/assets/dff84a93-de48-4a84-a5bd-a1693eaae0ec" /> | <img width="1217" height="402" alt="Button" src="https://github.com/user-attachments/assets/a63abf22-d447-4aeb-acb9-bdf6077b665b" /> |

---

## Features

| | |
|---|---|
| **✦ One-click optimization** | Crisp button sits right next to Claude's send button |
| **🧠 Smart classification** | Detects casual conversation and passes it through untouched |
| **⚡ Both-side savings** | Cuts input token bloat AND constrains output length |
| **🔍 Side-by-side diff** | See original vs rewritten before you commit |
| **📊 Token counter** | Know exactly how much you're saving per prompt |
| **🔑 Local key storage** | Your API key never leaves your browser |
| **🆓 Fully free** | Runs on Groq or Gemini — both have free tiers |

---

## Install

> Chrome Web Store listing coming soon. For now, install manually:

**1. Clone the repo**
```bash
git clone https://github.com/divyansh999-code/crisp.git
```

**2.** Open Chrome → go to `chrome://extensions`

**3.** Enable **Developer mode** (toggle, top right)

**4.** Click **Load unpacked** → select the cloned folder

**5.** Open [claude.ai](https://claude.ai) → the **✦ Crisp** button appears next to send

---

## Setup

**1.** Click the Crisp icon in your Chrome toolbar

**2.** Click **Open Settings**

**3.** Choose your model:
- **Groq** → free key at [console.groq.com](https://console.groq.com)
- **Gemini** → free key at [aistudio.google.com](https://aistudio.google.com)

**4.** Paste your key → **Save Settings**

Done.

---

## How it works

```
You type a prompt in Claude
        ↓
Click ✦ Crisp
        ↓
Crisp sends your prompt to Groq / Gemini with a rewriting system prompt
        ↓
Modal shows: Original ──→ Rewritten  +  tokens saved counter
        ↓
"Use this ✦"  →  replaces your input and you send as normal
"Keep original"  →  nothing changes
```

> Crisp never reads your Claude conversations. It only touches the text in the input box — and only when you explicitly click it.

---

## Token savings — real numbers

| Prompt type | Input (before) | Input (after) | Output (before) | Output (after) | Total saved |
|---|:---:|:---:|:---:|:---:|:---:|
| Padded technical ask | ~65 tokens | ~20 tokens | 681 tokens | 331 tokens | **~51%** |
| Verbose multi-part question | ~80 tokens | ~25 tokens | ~420 tokens | ~210 tokens | **~50%** |
| Casual / venting message | — | unchanged | — | unchanged | — |

*Input savings come from removing filler words. Output savings come from the `Be concise. No filler.` instruction Crisp appends to every rewrite.*

---

## The smart part

Crisp classifies your prompt before doing anything:

**Social / casual / emotional** → returned exactly as typed. No changes.

```
"ugh i'm so tired of everything nothing is working out"
→ untouched ✓
```

**Task / question / request** → optimized. Filler removed. Meaning preserved.

```
"I was wondering if you could explain how transformers work in simple terms"
→ "Explain how transformers work. Simple terms." ✓
```

---

## Stack

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Manifest V3](https://img.shields.io/badge/Manifest_V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat-square&logo=google&logoColor=white)

- No frameworks. No build step. No bundler.
- Chrome Extension Manifest V3
- Groq API — `llama-3.3-70b-versatile`
- Gemini API — `gemini-2.0-flash`

---

<div align="center">

### Built by [Divyansh Khandal](https://github.com/divyansh999-code)

AI & Data Science Student · MBM Engineering College, Jodhpur
SIH 2025 National Finalist · Building solo.

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/divyansh999-code)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/divyansh-khandal-5b8b8b32b)

<br/>

<sub>Crisp is not affiliated with Anthropic, Groq, or Google.</sub>

</div>
