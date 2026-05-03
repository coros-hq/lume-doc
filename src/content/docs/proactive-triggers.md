---
title: Proactive triggers
description: Register conditions that open the widget and send a message automatically.
---

Proactive triggers let Lume speak first — without the user having to open the widget or type anything. Register conditions against your live app context and Lume fires a message when something meaningful happens.

---

## Basic usage

```tsx
<LumeProvider
  triggers={[
    {
      id: 'billing-page',
      condition: (ctx) => ctx.currentPage === 'billing',
      message: "Need help understanding your invoice? I can walk you through it.",
      delay: 2000,
    },
    {
      id: 'payment-failed',
      condition: (ctx) => ctx.lastError === 'payment_failed',
      message: "It looks like your payment failed. Want me to help troubleshoot?",
    },
    {
      id: 'high-usage',
      condition: (ctx) => Number(ctx.usagePercent) >= 90,
      message: "You're getting close to your plan limit. Want me to help you understand your options?",
    },
  ]}
  ...
>
```

---

## Trigger shape

```ts
interface Trigger {
  id: string        // unique — prevents double-firing
  condition: (ctx: Record<string, string | number | boolean | null | undefined>) => boolean
  message: string   // what the assistant says
  delay?: number    // ms to wait before firing — default 0
}
```

---

## How it works

1. Every time `setContext` or `mergeContext` is called, all unfired triggers are evaluated
2. When a condition flips from `false` to `true` — the trigger fires
3. Lume opens the widget, waits briefly for it to be visible, then inserts the message as an assistant bubble
4. The trigger is marked as fired and never runs again for the rest of the session
5. The user replies normally — the AI continues the conversation from there

The message is **pre-written by you** — not AI generated. This makes it instant and predictable. The AI takes over the moment the user replies.

---

## delay

`delay` is the pause before the message appears after the condition is met. Useful to avoid immediately interrupting the user when they land on a page:

```tsx
{
  id: 'billing-page',
  condition: (ctx) => ctx.currentPage === 'billing',
  message: "Need help with your invoice?",
  delay: 3000,  // wait 3 seconds after arriving on billing
}
```

This is not an inactivity timer — it's a fixed pause after the condition becomes true.

---

## Fires once per session

Each trigger fires **once per session** — never repeats even if the condition stays true. This prevents the widget from becoming annoying.

If the user closes the widget and navigates away and back, the trigger does not fire again until the page is refreshed.

---

## Good trigger examples

```tsx
// user lands on a page that commonly causes confusion
condition: (ctx) => ctx.currentPage === 'billing'

// something just went wrong
condition: (ctx) => ctx.lastError === 'export_failed'

// user is approaching a limit
condition: (ctx) => Number(ctx.usagePercent) >= 90

// user upgraded — acknowledge it
condition: (ctx) => ctx.userPlan === 'Business'

// first visit to a complex feature
condition: (ctx) => ctx.currentPage === 'integrations' && ctx.hasSetupIntegration === false
```

---

## Bad trigger examples — avoid these

```tsx
// too broad — fires on almost every page
condition: (ctx) => ctx.currentPage !== 'dashboard'

// fires every time usage ticks up — annoying
condition: (ctx) => Number(ctx.usagePercent) > 50

// no specific event — just fires immediately on load
condition: (ctx) => true
```

The best triggers are **reactive to something the user just did** — not passive timers or broad conditions.