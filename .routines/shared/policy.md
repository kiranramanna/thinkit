# Content Policy

> Hard rules for any post produced by a routine. The writing prompt MUST enforce
> these; a post that violates any rule should be rejected and not committed.

## ABSOLUTE — never publish a post that:

1. **Names a real person other than Kiran Ramanna** by full name without prior
   public context (e.g., "according to the article by Jane Doe..." is OK if
   Jane Doe is the article's byline; inventing quotes attributed to her is not).
2. **Quotes content** from the linked article verbatim for more than ~20 words
   without quotation marks and attribution. Paraphrase or quote-and-cite.
3. **Makes specific medical, legal, financial, or immigration advice** in
   first-person voice. General observations OK; specific instructions to
   readers about their personal situations are not.
4. **Mentions a specific employer, customer, or internal ServiceNow project** by
   name. Generic references to "production AI work" or "enterprise CSM
   deployments" are fine. Specifics are not.
5. **Includes PII**: emails, phone numbers, addresses, government IDs.
6. **Uses profanity**, slurs, or politically inflammatory framing.
7. **Promotes** a product or company in a way that reads as paid promotion.
   Honest takes on products (positive or negative) are fine.

## SOFT — flag for human review (but the routine should still write):

- A post that takes a strong stance on a contentious tech-industry topic
  (e.g., specific founders, public layoffs, IP disputes). The routine writes it;
  you review before merging.

## Self-check the writing prompt must do

Before emitting a post, the writing prompt should:

- Confirm no full names of non-public figures.
- Confirm no verbatim quote > 20 words.
- Confirm no specific advice framed as instruction.
- Confirm no PII.
- If any check fails, the prompt returns `{"refuse": true, "reason": "..."}`
  instead of a post. The trigger logs this to state.json and proceeds to the
  next item.
