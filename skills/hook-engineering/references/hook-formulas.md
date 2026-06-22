# Hook formulas

A catalog of proven, high-retention opening formulas. Each entry: when it works,
a fill-in template, and a developer-content example. Pick the one that fits the
script's actual payoff — never force-fit.

---

## 1. The Result-First / Big Number

**When:** You have a concrete, surprising outcome.
**Why it works:** A specific number is a curiosity gap with built-in credibility.
**Template:** `I [verb] [metric] from [X] to [Y] [in timeframe].`
**Example:** "I dropped our Postgres query from 4.2 seconds to 30 milliseconds."

## 2. The Contrarian / Stop Doing X

**When:** Common practice is actually wrong or outdated.
**Why it works:** Pattern interrupt — challenges what the viewer believes.
**Template:** `Stop [common practice]. Here's what to do instead.`
**Example:** "Stop storing your API keys in environment variables. There's a better way."

## 3. The Mistake / Confession

**When:** You learned something the hard way.
**Why it works:** Vulnerability + the promise of a lesson the viewer can skip paying for.
**Template:** `I [made mistake] so you don't have to. / The [X] mistake that cost me [Y].`
**Example:** "I shipped an RLS policy that leaked every user's data. Here's how it happened."

## 4. The Direct Callout

**When:** The content serves a specific, nameable audience.
**Why it works:** Self-selection — the right viewer feels personally addressed.
**Template:** `If you're a [role] who [pain], this is for you.`
**Example:** "If you're a solo dev who's scared of database migrations, watch this."

## 5. The Curiosity Gap / Open Loop

**When:** There's a non-obvious "how" or "why" behind the payoff.
**Why it works:** The brain needs to close an open loop.
**Template:** `Here's how [surprising outcome] — without [expected cost].`
**Example:** "Here's how to add full-text search to your app without a search service."

## 6. The Bold Claim / Promise

**When:** You can genuinely over-deliver on a strong statement.
**Why it works:** Stakes the ground; dares the viewer to disagree.
**Template:** `[Tool/approach] is the [superlative] way to [goal]. Let me prove it.`
**Example:** "This is the fastest way to stand up auth in a Next.js app — under 5 minutes."

## 7. The Question

**When:** The viewer has likely hit this exact question.
**Why it works:** Names the viewer's own unspoken thought.
**Template:** `Ever [had this problem]? / Why does [annoying thing] happen?`
**Example:** "Why is your serverless function suddenly timing out at scale?"

## 8. In Medias Res / Story Drop

**When:** There's a moment of tension to start inside of.
**Why it works:** Drops the viewer into action; no runway.
**Template:** `It's [time] and [high-stakes thing is happening].`
**Example:** "It's 2am, production is down, and the logs say nothing."

## 9. The Listicle / Numbered Promise

**When:** The content is genuinely a set of discrete tips.
**Why it works:** Sets a clear, finite expectation — low cost to commit.
**Template:** `[N] [things] that [benefit]. Number [k] surprised me.`
**Example:** "3 Postgres indexes that will instantly speed up your app."

## 10. The Negativity / Warning

**When:** There's a real, avoidable risk.
**Why it works:** Loss aversion — we pay more attention to threats than gains.
**Template:** `[Thing you trust] is [quietly hurting you]. Here's the fix.`
**Example:** "Your `select *` queries are silently breaking as your schema grows."

## 11. The "Nobody Tells You"

**When:** You have insider/earned knowledge.
**Why it works:** Implies exclusive value not available elsewhere.
**Template:** `Nobody tells you [X] about [Y].`
**Example:** "Nobody tells you what actually happens to connections when you scale serverless."

## 12. The Before/After Transformation

**When:** There's a clear state change.
**Why it works:** Visual contrast; the viewer wants the "after."
**Template:** `[Painful before] → [clean after]. Here's the jump.`
**Example:** "From 300 lines of auth boilerplate to 3. Here's the jump."

---

## Per-platform notes

- **Short-form video (TikTok / Reels / Shorts):** Hardest cut. The first ~3
  seconds decide everything. Lead with the single most interesting word; say it
  before any visual setup. Formulas 1, 2, 3, 8, 10 punch hardest here.
- **Long-form video (YouTube):** You have ~5–10 seconds, but the thumbnail +
  title already set the promise — the spoken hook should pay *that* off
  immediately, not re-introduce it. Formulas 5, 6, 9 fit well.
- **Text (LinkedIn / X):** Only the first line shows before "…see more." It must
  earn the click on its own — no second line to lean on. Formulas 1, 2, 4, 11
  read strongest as a cold first line.

## Anti-patterns

- Greetings and channel intros ("Hey guys, welcome back…").
- "In this video/post I'm going to…" — describe the value, don't announce it.
- Vague abstractions ("Let's talk about performance").
- Two ideas fighting in one hook.
- A hook the content can't pay off.
