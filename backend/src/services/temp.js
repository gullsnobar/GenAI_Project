/**
 * temp.ts
 *
 * Sample test data for InterviewReport generation.
 * Deliberately specific (real numbers, real tools, real trade-offs) rather
 * than generic filler — so AI-generated matchScore / skillsGap / questions
 * have concrete signal to work with instead of vague boilerplate.
 */

const resume = `
John Doe
Backend / Full-Stack Engineer
john.doe@example.com | +1-555-0192 | Austin, TX
github.com/johndoe | linkedin.com/in/johndoe

EXPERIENCE

Software Engineer — Brightwave Technologies (Series B, ~80 employees)
Jan 2023 – Present

- Inherited a single Express.js monolith handling auth, billing, and
  notifications for ~50K MAU. Split it into 4 services (auth-service,
  billing-service, notification-service, core-api) communicating over
  internal REST + a Redis pub/sub channel for event fan-out. P95 latency on
  the /dashboard endpoint dropped from 1.4s to 410ms after decoupling
  notification sends from the request path.
- Redesigned the MongoDB schema for the billing collection after we hit
  16MB document sizes on accounts with long invoice histories — moved
  line-item history into a separate collection keyed by accountId + month,
  added a compound index on {accountId: 1, billingPeriod: -1}. Query time
  for "get last 12 months of invoices" went from ~900ms to ~45ms.
- Built a rate limiter middleware using Redis + sliding window counters
  after a client's misconfigured integration sent ~40K requests/min and
  briefly took down the shared staging environment.
- On-call rotation (1 week in 4). Wrote the incident postmortem for a
  Mongo connection pool exhaustion bug caused by a missing \`await\` in a
  retry loop — connections leaked at roughly 3/min under load until pool
  hit maxPoolSize=100 and new requests started timing out.

Backend Developer — Nimbus Solutions (agency, client work)
Jun 2021 – Dec 2022

- Built the Stripe integration for 3 different clients — handled webhook
  signature verification, idempotency keys for retried webhook events, and
  reconciliation logic for subscription proration edge cases (mid-cycle
  plan upgrades/downgrades).
- One client's checkout flow had a race condition where two webhook
  deliveries (invoice.paid arriving twice due to Stripe's at-least-once
  delivery) could double-credit an account. Fixed by storing processed
  event IDs in a dedupe table with a unique index, not by trusting
  application-level checks.
- Jest + Supertest for API tests, 85% line coverage on the payments
  module specifically (lower elsewhere, was not enforced repo-wide).

Junior Developer — Pixel Forge Studios
Aug 2020 – May 2021

- Maintained a legacy PHP 5.6 → 7.4 migration for an internal admin tool;
  mostly fixing deprecated function calls and mysqli → PDO conversions.
- Built two internal dashboards in React + Redux for tracking asset
  pipeline status across a 12-person art team.

EDUCATION
B.S. Computer Science, University of Texas at Austin, May 2020
Relevant coursework: Databases, Distributed Systems, Operating Systems

SKILLS
Strong: Node.js, Express, TypeScript, MongoDB (schema design, indexing,
aggregation pipeline), Redis, REST API design, Jest
Comfortable: PostgreSQL, Docker, AWS (EC2, S3, basic Lambda), GitHub Actions CI
Exposure only: GraphQL (one small internal tool, never in production at scale),
Kafka (read about it, never operated it), Kubernetes (deployed via a
pre-written Helm chart, didn't author one)
`;

const selfDescription = `
The thing I'm most proud of from the last year isn't a single feature, it's
the Mongo billing schema rework. It wasn't glamorous — nobody asked for it
until invoices started taking a second to load — but tracing it from "this
page is slow" down to "documents are too big and the index doesn't match the
query pattern" and fixing the actual cause instead of throwing a cache in
front of it taught me more about MongoDB than anything else I've done.

I'd say my biggest real weakness is that I default to fixing the system
rather than asking whether the system should exist in its current form. The
rate limiter is a good example — I built a solid sliding-window limiter, but
in hindsight the better fix might've been catching the misconfigured
integration earlier with stricter API key scoping. I've started trying to
ask "should this happen" before "how do I handle it happening," but it's a
habit I'm still building.

I haven't run anything at real scale — 50K MAU on a single Mongo replica set
is not the same problem as multi-region healthcare data with strict uptime
SLAs, and I want to be upfront about that gap rather than oversell it. What
I do have is a track record of actually root-causing production issues
instead of patching symptoms, and I pick up unfamiliar parts of a stack fast
when I have a concrete problem to anchor the learning to, rather than
studying it abstractly first.
`;

const jobDescription = `
Senior Backend Engineer — Stratos Health (Remote, US, healthcare SaaS)

Context
Stratos Health runs scheduling, billing, and care-coordination software for
outpatient clinics. We're at 240 clinics today, contractually committed to
onboard 600 more in the next 9 months. Our core-api service (Node.js 18,
TypeScript, MongoDB 6 on Atlas, M40 cluster) is the bottleneck — p99 latency
on the patient-search endpoint is currently 2.1s under peak load and our
SLA with clinics is 800ms p99. This role exists specifically to fix that and
to harden the system before the next onboarding wave.

What you'd actually work on in the first 90 days
- Patient-search endpoint: currently doing a $regex scan across a
  3.2M-document collection with no supporting text index. You'd own
  redesigning this — likely Atlas Search or a restructured compound index
  strategy — and proving the latency fix under realistic load (we use k6
  for load testing).
- Our billing-reconciliation job (runs nightly, processes ~80K claims) has
  started taking long enough that it occasionally overlaps with the next
  night's run. Needs profiling and likely a move from a single cron job to
  a queue-based worker model (we're leaning toward BullMQ on Redis, open to
  alternatives if you can justify them).
- HIPAA audit logging is currently inconsistent — some services log PHI
  access events, some don't. You'd help define and roll out a consistent
  audit-logging standard across services.

Must-have
- 4+ years backend, with Node.js/TypeScript in production specifically
  (not just familiarity).
- Real experience diagnosing and fixing MongoDB performance problems at the
  multi-million-document scale — not just schema design on greenfield
  projects.
- Comfortable owning a service through an incident, including writing the
  postmortem.
- Can read and reason about query execution plans (explain() output) without
  hand-holding.

Strongly preferred
- Healthcare, fintech, or other compliance-heavy domain experience —
  specifically because audit trails and data retention rules constrain
  design decisions in ways greenfield projects don't.
- Experience with queue-based job processing (BullMQ, SQS, or similar) for
  background work, since several of our nightly jobs need this.
- Has operated (not just used) Kafka or a similar event stream — we're
  evaluating moving inter-service events off Redis pub/sub onto Kafka in
  Q3 and want someone who's seen that trade-off play out before.

Explicitly not required
- Kubernetes authorship — we use a platform team's pre-built Helm charts,
  same as your current setup.
- GraphQL — our API is REST-only and staying that way for the foreseeable
  future.

Compensation: $145K–$175K base + equity, depending on level.
`;

export { resume, selfDescription, jobDescription };