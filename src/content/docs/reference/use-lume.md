---
title: useLume
description: Access widget controls and context methods from anywhere inside LumeProvider.
---

`useLume()` gives you access to Lume controls and context updates from any component inside `LumeProvider`. It throws if called outside a provider.

---

## Usage

```tsx
import { useLume } from '@ovt2/lume'

function MyComponent() {
  const { setContext, pushContext, open } = useLume()
}
```

---

## Returns

| Method | Type | Description |
|--------|------|-------------|
| `setContext(ctx)` | `(ctx: Record<string, ...>) => void` | Replace the entire context object |
| `mergeContext(partial)` | `(partial: Record<string, ...>) => void` | Update specific keys without replacing the whole context |
| `pushContext(note)` | `(note: string) => void` | Inject a hidden note into the conversation |
| `open()` | `() => void` | Open the chat panel |
| `close()` | `() => void` | Close the chat panel |
| `toggle()` | `() => void` | Toggle open/closed |
| `clearHistory()` | `() => void` | Clear all messages |

---

## useLumeSafe

If you need to call `useLume` in a component that might render outside the provider, use `useLumeSafe` — it returns `null` instead of throwing:

```tsx
import { useLumeSafe } from '@ovt2/lume'

function OptionalHelper() {
  const lume = useLumeSafe()
  if (!lume) return null

  return <button onClick={lume.open}>Get help</button>
}
```