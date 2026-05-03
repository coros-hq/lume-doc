---
title: Memory
description: Persist conversation history across sessions with localStorage.
---

Enable memory so users return to their previous conversation after closing the widget or refreshing the page.

---

## Basic usage

```tsx
<LumeProvider memoryKey="lume:myapp" ...>
// or
<AssistantWidget memoryKey="lume:myapp" />
```

That's it. Conversation history is automatically saved and restored.

---

## How it works

- On every message, the conversation is saved to localStorage under your `memoryKey`
- On next load, previous messages are restored and shown immediately when the widget opens
- Clearing history via the trash icon also clears localStorage
- Only user and assistant messages are persisted — system messages are not stored
- History is capped at the last 50 messages to avoid localStorage bloat

---

## Key naming

Use a unique key per app to avoid collisions if multiple Lume integrations share the same domain:

```tsx
memoryKey="lume:acme-support"   // good — specific
memoryKey="lume"                // too generic
```

A good pattern is `lume:{appname}` or `lume:{appname}:{userId}` if you want per-user history:

```tsx
memoryKey={`lume:acme:${user.id}`}
```

---

## Opt-in

Memory is opt-in. If `memoryKey` is not set, every session starts fresh and nothing is written to localStorage. Existing integrations are unaffected.

---

## Clearing history

The trash icon in the widget header clears both the in-memory messages and localStorage. You can also trigger it programmatically:

```tsx
const { clearHistory } = useLume()

// clears messages and localStorage
clearHistory()
```