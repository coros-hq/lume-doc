---
title: Context
description: Pass live app state to the assistant so it always knows where the user is.
---

Context is how Lume knows what's happening in your app right now. Pass any key/value object — it gets serialized into every prompt the assistant receives.

---

## Basic usage

```tsx
<AssistantWidget
  context={{
    currentPage: 'billing',
    userPlan: 'Pro',
    userRole: 'admin',
  }}
/>
```

The assistant receives this as readable text before every message:

Current app context:

- current page: billing
- user plan: Pro
- user role: admin

---

## With LumeProvider

With `LumeProvider`, use `setContext` and `mergeContext` from `useLume()` instead of passing context as a prop:

```tsx
function MyPage() {
  const { setContext, mergeContext } = useLume()

  // replace entire context on navigation
  useEffect(() => {
    setContext({
      currentPage: page,
      userPlan: user.plan,
      teamSize: team.length,
    })
  }, [page, user.plan, team.length])

  // update a single key
  const handleUpgrade = () => {
    mergeContext({ userPlan: 'Business' })
  }
}
```

---

## What to put in context

Context is most useful for things that change as the user navigates:

```tsx
setContext({
  // navigation
  currentPage: 'billing',
  currentModal: 'upgrade',

  // user state
  userPlan: 'Pro',
  userEmail: 'alex@acme.co',
  userRole: 'admin',
  isTrialing: false,

  // app state
  teamSize: 4,
  nextBilling: 'May 14, 2025',
  usagePercent: 78,

  // errors — very useful for support flows
  lastError: 'export_failed',
  lastErrorCode: 'QUOTA_EXCEEDED',
})
```

---

## Live events with pushContext

For one-off events that happen in your app, use `pushContext` instead of `setContext`. The note is injected as a hidden message in the conversation — the user never sees it, but the assistant does:

```tsx
const { pushContext } = useLume()

// payment error
pushContext(`Payment failed: card_declined`)

// export completed
pushContext(`Data export finished — CSV sent to ${user.email}`)

// user hit a limit
pushContext(`User hit the 10-member team limit on Pro plan`)
```

This is the most powerful way to give the assistant live situational awareness — it can respond to things that just happened without the user having to explain them.

---

## Context vs systemPrompt

| | `context` | `systemPrompt` |
|---|---|---|
| **Changes** | Every navigation | Set once |
| **Contains** | Live app state | Persona and rules |
| **Example** | `currentPage: 'billing'` | `"You are a support assistant"` |

Put static information (who the assistant is, what it should never do) in `systemPrompt`. Put dynamic information (where the user is, what plan they're on) in `context`.