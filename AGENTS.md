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

| You think                           | Reality                                          |
| ----------------------------------- | ------------------------------------------------ |
| "Just a simple question"            | Questions are tasks. Check for a skill.          |
| "Let me explore / look first"       | The skill tells you HOW to explore. Skill first. |
| "I'll just do this one thing first" | Check BEFORE doing anything.                     |
| "This skill is overkill"            | Simple turns complex. Load it.                   |
| "I already know this"               | Knowing ≠ doing. Load the current skill.         |

If more than one skill fits, load the **process skill first** — superpowers-brainstorming,
superpowers-systematic-debugging, superpowers-verification-before-completion — then the implementation skill.
"Build X" → superpowers-brainstorming first. "Fix this bug" → superpowers-systematic-debugging first.

## Priority

1. The user's explicit instructions (this file, `REASONIX.md`, direct asks) win over everything.
2. Skills override default behavior where they conflict.
3. A user request says WHAT to do, never "skip the skill." "Add X" still means: load the skill, then add X.

## Memory (anneal-memory)

This project uses anneal-memory for persistent memory across sessions —
four retrospective layers (episodes compress into continuity; Hebbian
links + a limbic tag form automatically) plus a **spore** store for
prospective open loops (`task`/`question`/`thought`, planted then
resolved) and an on-demand **crystallized** tier that holds proven, stable
patterns _out_ of always-loaded context and surfaces them on cue (opt-in +
harness-fired — see the SKILL or full snippet). Use memory naturally; don't
narrate the tooling.

**Start:** read the `anneal://continuity` resource. Empty = first session.

**During work:** `record` decisions, observations, tensions, questions,
outcomes, and context as they happen — the _reasoning_, not just the
fact ("chose X because Y"). Record proactively; target 5–15 episodes a
session. Plant a spore (`spore_add`) the moment a loop opens.

**Before decisions (NON-NEGOTIABLE):** call `recall` on the surface area
being decided and integrate what comes back. If it returns nothing,
proceed and note recall fired clean. Skipping this is the dead-store
failure mode — the store grows while decisions get made blind to it.

**Wrap (at "wrap up" / "save memory" / "we're done"):** run the full
sequence, once — `prepare_wrap` → compress per its instructions (this
step IS the thinking; principles over facts) → `save_continuity`.
Demoted graduations are the validation pipeline working, not an error;
don't re-run to chase a clean report. Cite real episode IDs honestly —
you are the first line of defense, the library is the second.

**Staying current:** after upgrading the package, run `anneal-memory
migrate check` — it proposes edits to _these_ instructions so they don't
drift from the substrate (it never edits your files); then `migrate ack`.
