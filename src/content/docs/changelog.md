---
title: Changelog
description: What changed in each version of Lume.
---

## v0.2.0

**Two-step intent classification**

Replaced single-shot prompting with a two-step architecture. A fast classifier call (~200–400ms) routes each message to the right handler before generating a response. This makes actions and components dramatically more reliable — indirect phrasings like "am I close to my limit" correctly route to `usage_bar` without needing exact keyword matches.

**LumeProvider and useLume**

New context provider pattern. Configure Lume once at the root and control context from anywhere with `useLume()`. No more prop drilling context through every component.

```tsx
const { setContext, mergeContext, pushContext, open } = useLume()
```

**defineComponent helper**

New `defineComponent` function mirrors `defineAction`. Registers a component with full TypeScript support, IDE autocomplete, and JSDoc examples.

**examples field**

Both `defineAction` and `defineComponent` now accept an optional `examples` array. Example phrases are injected into the intent classifier to improve matching for non-obvious phrasings.

**debug mode**

New `debug` prop shows intent classification badges on every user message. Instantly diagnose why something did or did not trigger without reading logs.

**Connection status indicator**

The widget header now shows a live Ollama connection status dot — green when connected, yellow while checking, red with tooltip when unreachable.

**peerDependencies fix**

`react` and `react-dom` moved from `dependencies` to `peerDependencies`. Fixes duplicate React errors in apps that install Lume.

---

## v0.1.5

- Actions with confirmation card
- Structured UI components with registry pattern
- Streaming responses with stop button
- RAG knowledge base with keyword-frequency scoring
- Ref API — `open()`, `close()`, `pushContext()`, `clearHistory()`
- `defineAction` helper
- TypeScript support

---

## v0.1.0

Initial release. Floating bubble widget with streaming chat, Ollama integration, and context injection.