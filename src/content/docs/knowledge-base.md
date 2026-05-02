---
title: Knowledge base
description: Give the assistant your documentation so it can answer questions about your app.
---

The knowledge base is how Lume answers questions about your app. Provide your documentation as plain text chunks — on every user message, the most relevant chunks are automatically retrieved and injected into the prompt.

No embeddings, no vector database, no external services required.

---

## Basic usage

```tsx
const docs = [
  {
    title: 'Exporting data',
    content: `
      You can export all your data as CSV from Settings → Export.
      Exports are processed in the background and emailed when ready.
      Large exports may take up to 10 minutes.
    `,
  },
  {
    title: 'Resetting your password',
    content: `
      Click Forgot Password on the login screen.
      You will receive a reset link valid for 24 hours.
      If you don't receive the email check your spam folder.
    `,
  },
]

<AssistantWidget knowledgeBase={docs} />
// or
<LumeProvider knowledgeBase={docs} ...>
```

---

## How retrieval works

On every user message, Lume runs a keyword-frequency scoring algorithm across all chunks:

1. Tokenizes the user message — removes stopwords, normalizes case
2. Scores each chunk by how many query tokens appear in it, normalized by chunk length
3. Injects the top 3 scoring chunks into the prompt as context

This means a user asking "how do I get my data out?" will retrieve the "Exporting data" chunk even though the words don't exactly match — shared tokens like "data" and "export" score it highly.

---

## Chunking tips

How you split your docs matters more than how much content you have.

**One topic per chunk:**

```tsx
// good — focused chunks score accurately
{ title: 'Billing overview', content: '...' }
{ title: 'Updating payment method', content: '...' }
{ title: 'Downloading invoices', content: '...' }

// bad — one giant chunk scores for everything and nothing
{ title: 'Billing', content: '... everything about billing ...' }
```

**Ideal chunk size: 150–400 words.** Too short and there aren't enough tokens to score well. Too long and the chunk dilutes its own score.

**Write descriptive titles.** The title is included in scoring. A title like "Exporting data as CSV" scores better than "Export" for a query about downloading files.

**Include synonyms naturally.** If users might say "invoice", "receipt", or "billing history" — make sure at least one chunk uses all three.

---

## Loading from files

With Vite, you can import markdown files directly:

```tsx
import billingDocs    from './docs/billing.md?raw'
import passwordDocs   from './docs/password.md?raw'
import exportDocs     from './docs/export.md?raw'

const knowledgeBase = [
  { title: 'Billing and payments', content: billingDocs },
  { title: 'Resetting your password', content: passwordDocs },
  { title: 'Exporting your data', content: exportDocs },
]
```

---

## Loading from a CMS

Fetch chunks at build time or runtime from any content source:

```tsx
// from a headless CMS
const articles = await cms.getArticles({ category: 'help' })

const knowledgeBase = articles.map(article => ({
  title: article.title,
  content: article.body,
}))

<LumeProvider knowledgeBase={knowledgeBase} ...>
```

---

## What makes a good knowledge base

The assistant has no prior knowledge of your app — it only knows what you give it. A well-structured knowledge base is the difference between an assistant that sounds like it knows your product and one that gives generic answers.

Cover these categories at minimum:

- **Billing** — plans, pricing, payment methods, invoices, cancellation
- **Account** — password reset, email change, deleting account
- **Core features** — how the main things in your app work
- **Common errors** — what went wrong and how to fix it
- **Limits** — quotas, plan limits, what happens when they're hit