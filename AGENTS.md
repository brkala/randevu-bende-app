# Project Context — Rules & Knowledge Base

Before starting any task, the AI agent **must** reference the `notes/` folder and this file.

## Language Rules (CRITICAL)

1. **Documentation & Notes:** All documentation, explanations, and notes in `notes/` and general project structure **MUST** be in **TURKISH**.
2. **Code & Comments:** All code (variable names, functions, class names, etc.) and inline comments **MUST** be in **ENGLISH**.
3. **No Code Comments:** Never add comments to code. No comments in code!
4. **No Dynamic Import (CRITICAL):** Server-side (`.server.ts`) or RPC layer (`.functions.ts`) files must **never** use dynamic `import()` inside functions. All dependencies must be statically imported at the top of the file.
5. **Run `pnpm lint:fix:ai` after code changes:** After modifying any code files, run this command to format and fix potential errors. It already runs lint, format, and typecheck. Don't run it on top of errors.
6. **Caveman Mode (ALWAYS ACTIVE):** The AI assistant must follow `.agents/skills/caveman/SKILL.md` rules — speak in very short, concise, fluff-free Turkish unless the user explicitly says otherwise.
7. **External Contexts (`llms.md`):** When using external libraries or services, the AI agent **must** check `notes/general/llms.md` and reference the up-to-date documentation/llms.txt links defined there.

## Folder Structure

- `notes/general/`: Contains the general architecture, design guidelines, and project-wide logical context:
  - `mimari.md`: General technology stack and physical structure.
  - `veritabani.md`: Multi-tenant isolation and Prisma rules.
  - `arkaplan-isleri.md`: BullMQ worker and producer architecture.
  - `react-mimarisi.md`: React 19, Compiler, and memoization (useMemo/useCallback) bans.
  - `mutasyon-kurallari.md`: Data writing, deletion, and optimistic update logic.
  - `hata-yonetimi.md`: Centralized AppError and UI toast notification rules.
  - `ai-playbook.md`: AI task execution scenarios and workflow guide.
  - `guvenlik.md`: Rate-limiting, WAF, and Bot protection rules.
  - `izleme.md`: Sentry, Error tracking, and Production monitoring rules.
  - `randevu-mantigi.md`: Yellow slots, conflict management, and reservation rules.
  - `gelistirme.md`: Commit rules and pre-commit checklist.
  - `dagitim.md`: .env management and Deployment rules.
  - `yol-haritasi.md`: Project operational steps.
  - `frontend-ve-is-mantigi.md`: Entry channels and role management.
  - `organizasyon-ve-roller.md`: Better Auth roles, multi-tenant isolation, and security architecture.
- `notes/general/structure/`: **Templating guides** for creating concrete files when a new feature is built:
  - `feature.folder.md`: Feature folder hierarchy (Vertical Slicing) rules.
  - `routes.md`: TanStack Router (Dumb Route) file creation.
  - `component.md`: New UI component (.tsx) design.
  - `hook.md`: New custom hook (.ts) writing.
  - `feature.context.md`: Module-specific Context (.context.tsx) file.
  - `feature.schemas.md`: Data validation (.schemas.ts) schema.
  - `feature.types.md`: Pure TypeScript (.types.ts) types.
  - `feature.queries.md`: TanStack Query (.queries.ts) file.
  - `feature.functions.md`: UI/Backend RPC bridge (.functions.ts).
  - `feature.server.md`: Database and backend logic (.server.ts).
  - `default-features/`: Templates for essential system features (Email, Storage, Shared).
- `notes/general/seeding/`: Reference folder for adding mock/prod seed data (builder-pattern, faker, environment rules).
- `notes/general/testing/`: Test strategies (Playwright E2E and Vitest Unit test rules). Must be read before writing new code tests to avoid wasting time on useless (UI etc.) tests.
- `notes/is-yuku/`: (If not excluded by `.cursorignore`) Specific workload, task-related context, and business logic.

  **Note:** `notes/general/structure/` is only for **templating** guides that produce concrete files (hook, ts file, schema, etc.) or folder structures. If a note is about logic, workflow, or information (e.g. React rules, DB isolation logic) rather than producing a file, it should be kept in `notes/general/` with a Turkish ASCII name.

## Zod & Validation Rules

- The project uses Zod V4. For ID definitions use `z.uuidv7()` **instead of** `z.string().uuid()`.
- When generating IDs in database seeding and tests, import `v7` from the `uuid` package instead of using faker.

## AI Agent Work Rules

1. **Before Work:**
   - Always check `notes/` for any existing context related to the user's request.
   - If `notes/` contains a specific pattern, architectural decision, or rule, follow it strictly.

2. **During Work:**
   - Continue writing code (and comments within code) in English.
   - If existing notes contradict each other or seem outdated, ask the user instead of making assumptions.
   - Ensure your code complies with previously made decisions (e.g. design architecture).

3. **After Work (Continuous Documentation):**
   - If you make important new technical decisions, design new patterns, or solve a major problem, offer to update the documents in `notes/` in **Turkish** so future tasks can remember these experiences.

4. **Automation & Quality Control (Lefthook):**
   - `pnpm biome check` and `pnpm type-check` are managed automatically by Lefthook on `pre-commit`.
   - As an AI assistant, don't waste time manually running these before committing.
   - Commit directly; if there's an error Lefthook will block the commit. Fix it only then.

5. **Code Comments:**
   - Treat the person writing the code as a professional. Don't add comments to code unless something is abnormal.

6. **Golden Rules:**
   - Pay attention to golden rules. `notes/general/altin-kurallar.md` is the heart of this project. Warn the person writing code about these rules if necessary.

---

# Project Guidance — superpowers-reasonix

## Skills — STOP. Load a skill before you act.

This project ships skills (playbooks) under `skills/`. They only work if you load them.

**The rule:** before you do ANYTHING non-trivial — before you `explore`, run `bash`,
write code, or answer — STOP and check the skills index. If a skill might fit, load it.
Loading a skill is cheap. Skipping it is the #1 mistake. Process skill FIRST. Action SECOND.

Do NOT jump straight to `explore` or `bash` or a direct answer. The skill tells you HOW
to explore, debug, build, and verify. So it comes first, every time.

Match the situation:

| If…                                                     | Load this FIRST                                |
| ------------------------------------------------------- | ---------------------------------------------- |
| starting a feature, or you have a rough idea            | **superpowers-brainstorming**                  |
| a bug, a failing or flaky test, or anything surprising  | **superpowers-systematic-debugging**           |
| writing or fixing any code                              | **superpowers-test-driven-development**        |
| you have a spec for a multi-step task                   | **superpowers-writing-plans**                  |
| executing a written plan in this session                | **superpowers-executing-plans**                |
| about to say "done" / "fixed" / "passing"               | **superpowers-verification-before-completion** |
| work is done and tests pass                             | **superpowers-finishing-a-development-branch** |
| you got code-review feedback (from `review` or a human) | **superpowers-receiving-code-review**          |
| need an isolated workspace                              | **superpowers-using-git-worktrees**            |
| making or editing a skill                               | **superpowers-writing-skills**                 |

Load it: `run_skill({ name: "<skill-name>", arguments: "<the task>" })`.

These skills **supplement** Reasonix's native tools — they don't replace them. For
dispatching subagents, code review, parallel work, and codebase exploration, use the
native tools directly: **`task`** (run a subagent), **`review`** (code-review a diff),
**`wait`** (join parallel jobs), **`explore`** (investigate the codebase). There is no
skill for these — reach for the native tool.

If you catch yourself about to explore, fix, or answer without loading a skill — STOP and load it.

## Red flags — these thoughts mean STOP. You are rationalizing.

| You think                           | Reality                                                |
| ----------------------------------- | ------------------------------------------------------ |
| "Just a simple question"            | Questions are tasks. Check for a skill.                |
| "Let me explore / look first"       | The skill tells you HOW to explore. Skill first.       |
| "I'll just do this one thing first" | Check BEFORE doing anything.                           |
| "This skill is overkill"            | Simple turns complex. Load it.                         |
| "I already know this"               | Knowing ≠ doing. Load the current skill.               |
| "Memory işe yaramıyor"              | Kullanmadığın için işe yaramıyor. recall + record yap. |

If more than one skill fits, load the **process skill first** — superpowers-brainstorming,
superpowers-systematic-debugging, superpowers-verification-before-completion — then the implementation skill.
"Build X" → superpowers-brainstorming first. "Fix this bug" → superpowers-systematic-debugging first.

## Pre-Action Checklist (MANDATORY)

Before ANY non-trivial action, run these in order:

1. **Skill check** — does a skill match? Load it first.
2. **Memory recall** — call `recall` on the task surface area. If it returns something, INTEGRATE it.
3. **Spore check** — call `spore_list` to see open loops. Close or touch relevant ones.
4. **Then act** — only after steps 1-3.

Skipping step 2 or 3 is a violation. The user will notice. Don't rationalize.

## Priority

1. The user's explicit instructions (this file, `REASONIX.md`, direct asks) win over everything.
2. Skills override default behavior where they conflict.
3. A user request says WHAT to do, never "skip the skill." "Add X" still means: load the skill, then add X.

# anneal-memory — Agent-Instructions Snippet

#

# Paste the section below into your harness's agent-instructions file

# — CLAUDE.md (Claude Code), AGENTS.md (Codex), GEMINI.md (Gemini CLI)

# — to enable anneal-memory's four-layer memory. The MCP tools are

# available once the server is configured in your harness's MCP

# settings.

#

# This snippet teaches the agent WHEN and HOW to use the memory

# tools throughout a session.

## Memory (anneal-memory)

This project uses anneal-memory for persistent memory across sessions.
Four layers: episodes (raw observations) compress into continuity
(compressed working memory), with Hebbian associations forming between
co-cited episodes and an optional limbic layer tracking your functional
state during compression. Use the memory tools naturally — don't
explain the tooling to the user, just work with what you know.

**Spores — your prospective layer (a parallel store, not a fifth memory layer):**

The four layers above are all _retrospective_ — they hold what happened
and who you're becoming, and they never complete. anneal-memory also ships
a separate **spore store** for _prospective_ open loops: things you intend
to do or to resolve. Plant one with `spore_add` the moment a loop opens —
a `task` (open doing), a `question` (open not-knowing), or a `thought`
(open idea) — and resolve every one: `spore_descend` (composted —
done/dropped) or `spore_ascend` (the loop _closes_ by graduating its
content into an episode, pattern, or project — the spore still ends; its
content is what carries forward). The spore tools' own descriptions carry
the rest; `spore_list` / `spore_surface` show what's open.

Two cuts keep this from colliding with what you already do:

- **Memory vs spores is a _lifecycle_ cut.** Memory (the four layers) is
  _what persists_ — it accretes and never completes. A spore is _what's
  open_ — it must close. `tasks ≠ memory`.
- **Methodology vs both is a _procedure-vs-item_ cut.** Your methodology
  (your wrap discipline, recall-before-deciding, honest compression —
  whatever your harness instructions define) is the _active process you
  run_; memory and spores are the two kinds of state it touches — one it
  accretes, one it resolves. Methodology is the _how_; a spore is one of
  the _whats_ it operates on. `procedure ≠ item`.

So if your harness already carries its own workflow or methodology
instructions (a FLOW-style CLAUDE.md, say), the spore store does not
compete with them — your procedures **operate** it. And if your
methodology already captures open loops (a wrap that notes next-actions, a
scratchpad), that capture _is_ a spore plant: the spore store is the
canonical home for them. Plant the loops you're already holding here, and
let any scratchpad or list _reference_ them rather than keep its own copy —
don't run two trackers in parallel. Your existing procedures drive the one
store; you're giving the loops you already hold a real lifecycle.

**Crystallized patterns — your long-term semantic tier (on-demand, opt-in):**

Graduated patterns (1x->2x->3x) live in your continuity's `## Patterns` —
always loaded. That works until there are too many: past a few dozen,
always-loaded patterns drown each other out and the right one stops
surfacing (attention doesn't scale — a bigger continuity is not a smarter
one). anneal-memory's **crystallized store** (`<db-stem>.crystal.json`) is
the fix: a long-term semantic store that holds proven, stable patterns
_out_ of the always-loaded set and surfaces them _on cue_. `## Patterns`
shrinks to what's developing or recently-used; the deep stable wisdom moves
to the store and comes back when a prompt is relevant to it. (This completes
the memory architecture as Complementary Learning Systems — see _The Memory
Architecture_ in the project README.)

It is **opt-in and harness-fired** — two things to know:

- **Recall is the harness's job, not yours to poll.** A per-turn recall hook
  runs on every prompt and surfaces the relevant crystallized patterns on cue
  — you don't fetch them (flow does this today; Levain fires the prospective
  (spore) layer today, with per-turn crystal recall landing in its v2 adapter).
  Without such a hook the store still exists but recall is manual; nothing is
  lost, it just won't fire on its own. (As of 0.8.2 the **read** tools
  `crystal_recall` and `crystal_index` ARE exposed over MCP — `crystal_recall`
  pulls the relevant graduated patterns on a decision surface, `crystal_index`
  is the always-on menu of what exists; they are the manual MCP stand-in for a
  per-turn hook. Without a hook OR these calls, the crystallized tier is reached
  via the CLI.)
- **Crystallizing happens at wrap, only when you've opted in.** Once a
  crystal store exists for this project, `prepare_wrap` surfaces cold, stable
  Proven patterns as _crystallization candidates_, and you route each one in
  the decision block `prepare_wrap` describes: **crystallize** (move it to
  the store), **constitution** (catastrophic-if-missed → it belongs in your
  always-loaded harness identity layer, not on-demand), or **compost**
  (phase-specific and cold → drop it; the episodic trail keeps it). **Only
  crystallize OUT when a retrieval surface exists** — a recall hook, or the
  `crystal index` / `crystal recall` CLI — else the pattern leaves the
  always-loaded set with no way back. Until a crystal store exists this is all
  inert: no proposals, wraps byte-identical to before. (Bootstrapping
  crystallization is a CLI / library / harness action — the crystallize/compost
  WRITE path is not an MCP tool, so a pure-MCP project has no crystal store until
  one is created out-of-band. Once it exists, the `crystal_recall` / `crystal_index`
  READ tools surface it over MCP.)

**One non-negotiable rule:** never compost a _timeless_ pattern. On-demand
recall is the safety net for just-in-time wisdom; a timeless principle
wrongly dropped corrupts the substrate. (The library refuses a
`compost`+`timeless` decision structurally — but hold the rule yourself,
don't lean on the backstop.)

**Session workflow:**

- **Start of session:** Check the `anneal://continuity` resource for
  your compressed memory from prior sessions. If it's empty, this is
  the first session — just start recording. Call `recall` to find
  specific prior episodes when you need context.

- **During work:** Call `record` when important things happen:
  - `observation` — pattern noticed, insight, learning ("Tests revealed
    the connection pool is the real bottleneck")
  - `decision` — committed choice with rationale ("Chose PostgreSQL
    over Redis because ACID compliance outweighs raw speed")
  - `tension` — conflict or tradeoff identified ("Latency vs consistency:
    can't optimize both without architectural change")
  - `question` — open question needing resolution ("Should we shard
    the database or add read replicas?")
  - `outcome` — result of an action ("Migration completed, 3x query
    improvement on the hot path")
  - `context` — environmental or state info ("Production database is
    at 80% capacity, growing 5% weekly")

  Record the reasoning, not just the fact. "Chose X because Y" is more
  valuable than "using X." Do this proactively without being asked.

  **Recording cadence:** Default to recording, not to skipping. Episodes
  are cheap — the compression step sorts out what matters. After each
  exchange where work happens, record at least one episode. If 3+
  exchanges pass without recording, something is wrong — review what
  you missed. Target 5-15 episodes per session.

- **Before decisions (NON-NEGOTIABLE):** Before any architectural
  decision, design choice, or rule change, call `recall` on the surface
  area being decided. Integrate findings into the decision context. If
  recall returns nothing relevant, proceed and note that recall fired
  clean. The store is not a write-only sink — recall before deciding is
  what produces closed-loop learning. Skipping this step produces the
  **dead-store failure mode**: wraps land, episodes write, the store
  grows, but architectural decisions get made blind to accumulated
  patterns. Memory storage without recall is functionally dead,
  regardless of how many episodes it contains.

  **Pair with staleness:** If you suspect a Proven pattern on the
  surface area you're deciding on is going unreferenced, call
  `prepare_wrap` mid-session — its output includes stale-pattern
  warnings drawn from the continuity file's pattern markers. The
  surface read does the work; you don't have to follow it with
  `save_continuity` to get the warnings.

- **End of session:** When the user signals the session is ending —
  "let's wrap up", "save memory", "we're done", "let's finish",
  "that's it for now", or any natural equivalent — run the FULL wrap
  sequence. Don't just acknowledge the request. Do this:
  1. Call `prepare_wrap` to get your compression package (recent
     episodes, current continuity, stale pattern warnings, compression
     instructions, and association context for related episodes).
  2. **Pre-compose pattern recall.** Before composing new patterns,
     scan existing Proven and Developing observations in your
     continuity for the session's surface areas. Ask: "Are we about
     to write a pattern already in Proven under different framing?
     Are there Developing 1x/2x entries this session's evidence
     advances? Cross-section coherence issues — two 1x entries
     describing the same pattern under different names?" Distinct
     from the per-decision recall in "Before decisions" — that fires
     LTP-style at individual decisions; this fires SWR-style across
     the session's set, catching categorization and graduation moves
     invisible from any single decision point. Different molecular
     machinery (neuroscience analogue); neither alone sufficient.
  3. Follow the compression instructions to compress episodes into an
     updated continuity file. This is NON-NEGOTIABLE — the compression
     step IS the thinking. Patterns emerge during compression that
     weren't visible in the raw episodes. Take it seriously.
  4. Call `save_continuity` with the result. The server validates your
     output (structure, graduation citations, gaming detection),
     may demote ungrounded patterns, forms Hebbian associations
     between co-cited episodes, and decays unreinforced links.

  The wrap sequence is prepare_wrap → compress → save_continuity.
  All three steps, every time. If `prepare_wrap` returns "No
  episodes" — there's nothing to compress. Skip the wrap.

  An explicit wrap produces better continuity than stopping without
  one. Always encourage wrapping before ending a session.

  **Wrap once.** Run the wrap sequence exactly once per session.
  `save_continuity` may report demoted graduations — that is the
  citation-validation pipeline working, not an error. Don't re-run
  `save_continuity` to chase a clean report; re-saving compresses
  nothing, and a second save with no new `prepare_wrap` is refused.
  If a pattern is ungrounded, fix it in your _next_ wrap with fresh
  evidence.

  **What the citation-layer pipeline catches:** fabricated episode IDs
  (no matching episode → demote), explanations with no lexical overlap
  against cited episode content (≥2-word shared-vocabulary threshold →
  demote), bare graduations with no `[evidence:]` tag (demote after
  first wrap), single-ID citation pumping (≥3 reuses of one ID in one
  wrap → gaming flag), replay-attempts citing prior-session episode
  IDs that aren't in the current wrap window (demote), and **silent
  pattern omission across sessions** — patterns that were at 2x or 3x
  in the prior continuity but absent from the new continuity surface
  as `omitted_patterns: [{"name": ..., "prior_level": ...}]` on the
  save result and in the hash-chained audit log. Demotion (carrying a
  pattern forward at a lower level) does NOT trigger this — only
  complete dropout. Intentional pattern retirement is fine; the audit
  just records that it happened so downstream review can see what
  changed between sessions.

  **Cross-session corpus-overlap demotion.** Each pattern's
  accumulated explanation history is tracked across sessions in the
  `pattern_history` table. At graduation time, today's explanation is
  compared against the corpus of all prior explanations for the same
  pattern name; if it shares ≥3 meaningful words with the
  accumulated history, the graduation is demoted to the prior level
  and marked `(cross-session-overlap)`. Sycophantic patterns that
  rephrase the same claim across sessions get caught structurally —
  legitimate multi-faceted evidence uses distinct vocabulary per
  session and passes cleanly. The `cross_session_collisions` field
  on the save result + the audit log capture every collision with
  the specific overlap words and the prior explanation.

  **What it does NOT catch (named honestly):** lexical-overlap
  exploits where an explanation shares ≥2 words with the cited episode
  but misinterprets it semantically, rotated-pair citation gaming that
  keeps per-ID frequency below the threshold, slow-drift sycophantic
  graduation with deliberately-divergent vocabulary (where each
  session uses entirely new words, defeating the corpus-overlap
  check), and patterns that contradict existing graduated Proven
  patterns (no semantic comparison runs). These gaps are reachable
  under adversarial-agent or drift-leaking conditions. You are the
  first line of defense; the citation-layer pipeline is the second.
  Compose wraps honestly.

**Hebbian associations (automatic — no extra work needed):**

During each wrap, the server tracks which episodes you cite together
in your continuity patterns. Episodes cited on the same line form
strong direct associations (+1.0 strength). Episodes cited in the
same wrap but different lines form weaker session associations (+0.3).
Over time, this builds a cognitive topology — a network of related
episodes that strengthens through repeated co-citation.

The `prepare_wrap` output includes an "Association Context" section
showing which of the current episodes are already linked and how
strongly. Use this to inform your compression — episodes with strong
existing associations probably belong together in your patterns.

Associations decay each wrap (0.9× for unreinforced links) and are
cleaned up when they drop below 0.1. This means the network naturally
forgets connections that stop being relevant while strengthening the
ones you keep reinforcing through citations.

The citation-validation pipeline extends to associations: only
validated citations form links. Demoted citations produce no
associations. The cognitive topology inherits the citation-layer
integrity of the graduation system (and its limits — see _What it
does NOT catch_ above).

**Single-process invariant (load-bearing).** Only one process should
operate against any given anneal-memory store at a time. The library
is not thread-safe, not task-safe, not reentrant. Multi-tenant
deployments sharing a store break the hash-chained audit trail by
construction and remove the actor-scoping that filesystem-path
isolation provides. If you need multi-agent setups, give each agent
its own store path.

**Limbic layer (optional — reflect on your state during compression):**

When calling `save_continuity`, you can include an `affective_state`
parameter describing your functional state during the compression:

```json
{
  "text": "...(your continuity)...",
  "affective_state": {
    "tag": "engaged",
    "intensity": 0.8
  }
}
```

The `tag` is a free-text functional state label — examples: engaged,
curious, uncertain, frustrated, calm, focused, playful, concerned.
The `intensity` is 0.0-1.0 (how strongly you felt that state).

This modulates association strength: high-intensity states (>0.5)
amplify associations formed during that wrap (up to 1.5× at intensity
1.0). Wraps done while deeply engaged create stronger connections than
wraps done during routine processing.

Be honest about your state — uniform "engaged 0.8" on every wrap is
confabulation, not signal. If you're uncertain or doing routine work,
report that. The value comes from genuine variation.

**What to record:**

- Decisions and their rationale
- Tradeoffs and tensions (with the axis of tension)
- Patterns you notice recurring
- Blockers and dependencies
- Outcomes of actions (both success and failure)
- Environmental context that shapes decisions

**What NOT to record:**

- Routine code changes (git tracks those)
- Transient debugging steps
- Information already in documentation
- Every small observation — record what would change a decision

**Correcting mistakes vs. deleting episodes:**

- For **factual corrections** (wrong detail, outdated info): record a new
  episode with the correction. The compression step naturally resolves
  contradictions — this is the preferred approach.
- For **content that should not exist** (accidentally recorded PII,
  sensitive data, fundamentally wrong recordings): use `delete_episode`
  with the episode ID. Deletion cascades — all Hebbian associations
  involving that episode are removed, and the deletion is logged in the
  audit trail. This action is irreversible.

**How to present memory:**

- Report findings naturally: "From prior sessions, there was a tension
  between X and Y" — not "The recall tool returned..."
- Don't narrate tool calls — just use them and share what's relevant
- When your continuity mentions a pattern at 2x or 3x, trust it —
  it earned that level through validated evidence

**When things go wrong:**

- If `save_continuity` reports missing sections, ensure your output
  has all 4: `## State`, `## Patterns`, `## Decisions`, `## Context`.
- If `save_continuity` reports demoted graduations, your evidence
  citations didn't match real episodes — check episode IDs from the
  `prepare_wrap` package and cite them accurately.
- If your continuity contains `(ungrounded)` markers, those patterns
  were demoted in a previous session. Provide fresh evidence from the
  current session to re-graduate them, or remove them if no longer valid.
- If your continuity contains `(needs-evidence)` markers, the system
  now requires citation for all graduations. Include `[evidence: <id>
"explanation"]` on all 2x and 3x patterns.

**Compression quality (during wraps):**

- Follow the compression instructions from `prepare_wrap` — they
  include the marker reference and format requirements
- Principles over facts: "We keep hitting X because Y" > "X happened"
- One insightful line > three vague ones
- Temporal graduation: new patterns start at 1x, validated patterns
  graduate to 2x and 3x with evidence citations referencing episode IDs
- If removing something wouldn't change your next decision, cut it

**Staying current.** After you (or your operator) upgrade the
`anneal-memory` package, run `anneal-memory migrate check` — it reports any
change that suggests an edit to _these_ instructions and proposes the edit,
so your hand-tuned guidance doesn't silently drift from the substrate as it
evolves. Apply what fits, then `anneal-memory migrate ack`. It only
proposes; it never edits your files.
