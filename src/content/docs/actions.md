---
title: Actions
description: Let the assistant trigger real functions in your app, with a confirmation step before execution.
---

Actions let the assistant do things — not just answer questions. When the user's message matches a registered action, a confirmation card appears. The user confirms or cancels — then your handler fires.

---

## Basic usage

```tsx
import { defineAction } from '@ovt2/lume'

const actions = [
  defineAction(
    'redirectTo',
    {
      description: 'Navigate to a page in the app',
      parameters: {
        page: {
          type: 'string',
          required: true,
          description: 'dashboard, billing, settings, or team',
        },
      },
    },
    async ({ page }) => {
      router.push(page as string)
    }
  ),
]

<LumeProvider actions={actions} ...>
```

---

## How it works

1. User types `"take me to billing"`
2. Intent classifier routes to `action:redirectTo` (~200ms)
3. Lume extracts parameters — `{ page: "billing" }`
4. Confirmation card appears
5. User clicks **Confirm** → handler fires
6. User clicks **Cancel** → dismissed, handler never called

The confirmation step always happens. The model can never trigger a handler silently.

---

## Parameters

```tsx
defineAction(
  'inviteTeamMember',
  {
    description: 'Invite a new team member by email',
    parameters: {
      email: {
        type: 'string',
        required: true,
        description: 'Email address of the person to invite',
      },
      role: {
        type: 'string',
        required: true,
        description: 'Role to assign: admin or viewer',
      },
    },
  },
  async ({ email, role }) => {
    await api.inviteUser({
      email: email as string,
      role: role as string,
    })
  }
)
```

Supported parameter types: `string`, `number`, `boolean`.

---

## Adding examples

Add example phrases to improve intent matching:

```tsx
defineAction(
  'redirectTo',
  {
    description: 'Navigate to a page in the app',
    examples: [
      'take me to billing',
      'go to settings',
      'open the dashboard',
      'navigate to team',
    ],
    parameters: { ... },
  },
  async ({ page }) => router.push(page as string)
)
```

Examples are optional — a clear `description` handles most cases on its own.

---

## Multiple actions

```tsx
const actions = [
  defineAction('redirectTo',       { ... }, async ({ page })             => setPage(page as string)),
  defineAction('inviteTeamMember', { ... }, async ({ email, role })      => api.invite(email, role)),
  defineAction('removeTeamMember', { ... }, async ({ email })            => api.remove(email)),
  defineAction('exportData',       { ... }, async ({ type })             => api.export(type)),
  defineAction('scheduleReport',   { ... }, async ({ frequency, email }) => api.schedule(frequency, email)),
]
```

---

## Rules the model follows

- Actions only trigger when the user **explicitly asks** to do something
- Greetings, questions, and small talk never trigger actions
- The confirmation step is always shown — there is no way to skip it

---

## Custom confirmation UI

When building a custom UI with `useAssistant`, you get full access to the confirmation state:

```tsx
const { confirmation, confirmAction, cancelAction } = useAssistant({ ... })

if (confirmation.status === 'pending') {
  return (
    <div>
      <p>{confirmation.action.description}</p>
      {Object.entries(confirmation.call.parameters).map(([key, value]) => (
        <div key={key}>{key}: {String(value)}</div>
      ))}
      <button onClick={confirmAction}>Confirm</button>
      <button onClick={cancelAction}>Cancel</button>
    </div>
  )
}
```

See [useAssistant reference](/reference/use-assistant) for the full API.