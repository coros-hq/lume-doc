---
title: defineAction
description: Register an action the assistant can trigger in your app.
---

`defineAction` is a helper function for registering actions with full TypeScript support and IDE autocomplete.

---

## Signature

```ts
function defineAction(
  name: string,
  options: DefineActionOptions,
  handler: (params: Record<string, unknown>) => Promise<void>
): Action
```

---

## Parameters

### name

A unique internal identifier for the action. Used by the classifier and parser — never shown to the user.

```tsx
defineAction('redirectTo', ...)
defineAction('inviteTeamMember', ...)
defineAction('exportData', ...)
```

### options.description

What the action does. The intent classifier uses this to match user messages. Write it to clearly describe the user intent, not the technical implementation:

```tsx
// good
description: 'Navigate to a page in the app'

// bad
description: 'Calls router.push with page parameter'
```

### options.parameters

The parameters the model extracts from the user message. Each parameter has a `type`, `description`, and optional `required` flag:

```tsx
parameters: {
  email: {
    type: 'string',
    required: true,
    description: 'Email address of the person to invite',
  },
  role: {
    type: 'string',
    required: false,
    description: 'Role to assign: admin or viewer. Defaults to viewer.',
  },
}
```

Supported types: `string`, `number`, `boolean`.

### options.examples

Optional. Example phrases that trigger this action. Injected into the classifier to improve matching for non-obvious phrasings:

```tsx
examples: [
  'take me to billing',
  'go to settings',
  'open the dashboard',
]
```

### handler

An async function called after the user confirms the action. Receives the extracted parameters as `Record<string, unknown>` — cast to the expected types:

```tsx
async ({ email, role }) => {
  await api.inviteUser({
    email: email as string,
    role: role as string,
  })
}
```

---

## Full example

```tsx
defineAction(
  'inviteTeamMember',
  {
    description: 'Invite a new team member by email',
    examples: [
      'invite someone to my team',
      'add alex@company.com as admin',
      'give sara viewer access',
    ],
    parameters: {
      email: { type: 'string', required: true,  description: 'Email address' },
      role:  { type: 'string', required: true,  description: 'admin or viewer' },
    },
  },
  async ({ email, role }) => {
    const initials = (email as string).split('@')[0].slice(0, 2).toUpperCase()
    setTeam(prev => [...prev, { email: email as string, role: role as string, initials }])
    showNotification(`Invite sent to ${email}`)
  }
)
```