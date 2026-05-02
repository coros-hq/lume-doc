---
title: LumeProvider
description: Set up Lume once at the root and control everything from anywhere with useLume().
---

`LumeProvider` is the recommended way to integrate Lume. Configure everything once at the root of your app — then use `useLume()` from any component to update context, push events, and control the widget.

---

## Setup

Wrap your app with `LumeProvider`:

```tsx
import { LumeProvider } from '@ovt2/lume'

export default function App() {
  return (
    <LumeProvider
      model="qwen2.5"
      systemPrompt="You are a support assistant for Acme."
      knowledgeBase={docs}
      actions={actions}
      components={components}
      accentColor="#6366f1"
      title="Acme Support"
    >
      <YourApp />
    </LumeProvider>
  )
}
```

Then place `<AssistantWidget />` anywhere inside — no props needed:

```tsx
function Layout() {
  return (
    <>
      <Nav />
      <Main />
      <AssistantWidget />
    </>
  )
}
```

---

## useLume

`useLume()` gives you access to context controls and widget methods from any component inside the provider.

```tsx
import { useLume } from '@ovt2/lume'

function MyPage() {
  const {
    setContext,
    mergeContext,
    pushContext,
    open,
    close,
    toggle,
    clearHistory,
  } = useLume()
}
```

### Methods

| Method | Description |
|--------|-------------|
| `setContext(ctx)` | Replace the entire context object |
| `mergeContext(partial)` | Update specific keys without replacing the whole context |
| `pushContext(note)` | Inject a hidden note into the conversation — never shown to the user |
| `open()` | Open the chat panel |
| `close()` | Close the chat panel |
| `toggle()` | Toggle open/closed |
| `clearHistory()` | Clear all messages |

---

## Syncing context

The most important pattern — sync context whenever your app state changes:

```tsx
function InnerApp() {
  const { setContext } = useLume()
  const [page, setPage] = useState('dashboard')
  const { user, team } = useAppState()

  useEffect(() => {
    setContext({
      currentPage: page,
      userPlan: user.plan,
      userEmail: user.email,
      teamSize: team.length,
    })
  }, [page, user.plan, team.length])
}
```

The assistant always sees the latest values because the prompt is rebuilt on every message.

---

## Pushing live events

Use `pushContext` to silently inform the assistant about things that happen in your app. The note is injected as a hidden system message — the user never sees it:

```tsx
// on payment error
try {
  await processPayment()
} catch (err) {
  pushContext(`Payment failed: ${err.code}`)
}

// on navigation
router.afterEach((to) => {
  pushContext(`User navigated to: ${to.name}`)
})

// on plan change
const handleUpgrade = (newPlan: string) => {
  mergeContext({ userPlan: newPlan })
  pushContext(`User upgraded to ${newPlan}`)
}
```

---

## Opening the widget programmatically

Open the widget from a help button, an error state, or anywhere in your app:

```tsx
function HelpButton() {
  const { open } = useLume()
  return <button onClick={open}>Get help</button>
}
```

---

## Props override

Props passed directly to `AssistantWidget` always win over provider values. Useful for overriding in specific parts of your app:

```tsx
// provider sets model to qwen2.5
<LumeProvider model="qwen2.5" ...>

  // this page uses a different title
  <AssistantWidget title="Billing Support" />

</LumeProvider>
```

---

## Without LumeProvider

If you prefer not to use the provider, pass all props directly to `AssistantWidget` and use a ref for programmatic control:

```tsx
import { useRef } from 'react'
import { AssistantWidget } from '@ovt2/lume'
import type { AssistantHandle } from '@ovt2/lume'

function App() {
  const ref = useRef<AssistantHandle>(null)

  return (
    <AssistantWidget
      ref={ref}
      model="qwen2.5"
      systemPrompt="You are a helpful assistant."
      context={{ currentPage: 'dashboard' }}
    />
  )
}
```

See [Props reference](/reference/props) for the full list.