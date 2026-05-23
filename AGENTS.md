# AGENTS.md

Guidance for AI agents working in this repository.

## Project

**Kill Criteria** is a mobile-first decision guide for Philippine civil engineers. It walks users through career decisions one question at a time, based on Annie Duke's kill criteria framework from *Quit*.

Three interactive flows:

1. **Quit job** — compensation, growth, environment
2. **Change employer or niche** — pattern check, passion, niche tracks
3. **Leave civil engineering** — OFW track, pivot options, clean exit

Reference HTML decision trees live in `reference/` and were the source for flow content.

## Stack

- React 19 + TypeScript
- Vite 6
- React Router 7
- CSS Modules (no Tailwind, no component library)
- Deployed on Vercel as a static SPA (`vercel.json` handles routing)

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Architecture

- **Data-driven flows** — Decision trees are plain TypeScript objects in `src/data/`. Each flow file (`quitJob.ts`, `changeEmployer.ts`, `leaveProfession.ts`) exports a `FlowDefinition` with typed nodes: `start`, `question`, and `outcome`.
- **One question per page** — `Flow.tsx` renders the current node; `useFlowState` manages navigation, path history, and `localStorage` session persistence.
- **Reference blocks** — Questions and outcomes can attach structured reference content (salary tables, niche grids, checklists, etc.) rendered by `ReferencePanel`.
- **Calm engineering design** — Blueprint-inspired visual system in `src/styles/`. Respect reduced-motion preferences via `useReducedMotion`.

When adding or editing flow content, update the TypeScript data files — not the React components — unless the node type or reference block shape needs to change.

## Project layout

```
src/
  data/           Flow definitions and shared types
  routes/         Hub (landing) and Flow (wizard)
  components/     UI: QuestionCard, OutcomeCard, ChoiceButtons, etc.
  hooks/          useFlowState, useReducedMotion
  styles/         Design tokens, global styles, motion
reference/        Source HTML decision trees
```

## Code conventions

- Keep imports at the top of files; no inline imports.
- Use exhaustive switch handling for TypeScript unions and enums.
- Colocate component styles as `*.module.css` next to the component.
- Prefer minimal, focused diffs. Match existing naming and patterns.
- Do not add tests, docs, or abstractions unless requested or clearly needed.
- Only create git commits when explicitly asked.

## Commits

Always use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

Format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:

| Type | Use for |
|------|---------|
| `feat` | New feature or user-facing capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance tasks |

Examples:

```
feat(flow): add handoff from quit-job to change-employer outcome
fix(session): restore path when resuming from localStorage
docs: update AGENTS.md with commit conventions
style(hub): tighten card spacing on small screens
```

Rules:

- Use lowercase for the type.
- Keep the subject line imperative and under ~72 characters.
- Add a scope when the change is localized (e.g. `feat(data):`, `fix(flow):`).
- Use `BREAKING CHANGE:` in the footer (or `!` after the type) for breaking changes.
- One logical change per commit when possible.

## Tone and UX

This app is for people making stressful career decisions. Copy should be calm, clear, and non-judgmental. Avoid urgency, hype, or decision overload. One question at a time.
