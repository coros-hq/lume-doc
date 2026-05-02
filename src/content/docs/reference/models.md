---
title: Models
description: Compare available Ollama models and choose the right one for your use case.
---

Lume works with any model available in Ollama. The right choice depends on what features you're using and how much RAM your machine has.

---

## Recommendations

| Model | Size | RAM | Best for |
|-------|------|-----|----------|
| `qwen2.5` | 7B | 6 GB | **Recommended** — best tool-calling reliability for actions and components |
| `llama3.1` | 8B | 8 GB | Strong reasoning, good alternative to qwen2.5 |
| `mistral` | 7B | 8 GB | Solid general-purpose option |
| `gemma3` | 4B | 4 GB | Lighter and faster — good for chat-only without actions or components |

---

## Why qwen2.5

If you are using actions or structured UI components, `qwen2.5` is strongly recommended. It was fine-tuned specifically for tool-calling and JSON output. Other models can work but are more likely to:

- Return JSON in the wrong format
- Add text before or after JSON blocks
- Trigger components on the wrong intent

For chat-only use without actions or components, any model works well.

---

## Pulling a model

```bash
ollama pull qwen2.5     # recommended
ollama pull llama3.1    # alternative
ollama pull gemma3      # lightweight
```

---

## Apple Silicon

On M1/M2/M3 Macs, Ollama automatically uses the GPU via Metal. No configuration needed.

**Approximate performance on M2 Air 16GB with qwen2.5 7B:**

| Metric | Value |
|--------|-------|
| Cold start | 3–5 seconds |
| First token | under 1 second |
| Generation speed | ~40–60 tokens/sec |
| Classification call | ~200–400ms |

This is fast enough to feel instant in a chat widget. The 14B model also runs on 16GB but starts to crowd RAM if other apps are open — the quality improvement for actions and components is not worth it.

---

## Switching models

Change the `model` prop at any time:

```tsx
<LumeProvider model="llama3.1" ...>
// or
<AssistantWidget model="gemma3" />
```

The same model is used for both the intent classifier and the response generator.