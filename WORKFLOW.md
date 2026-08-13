# WORKFLOW.md — AI-Assisted Workflow Drill (FE-03)

## Feature
A User Profile settings form (Full Name, Email, Phone, Bio) built twice using GitHub Copilot in Agent mode inside VS Code: once with a deliberately vague one-line prompt, once with a precise, constraint-driven prompt.

## Round 1 — Vague Prompt
**Prompt:** "Make me a settings form"

Copilot filled in every gap with its own assumptions. The output included profile inputs, notification toggles, appearance/theme controls, and segmented option groups — a small settings *dashboard* rather than the single form that was actually needed. This is scope creep: none of the toggle/appearance features were requested, and reviewing them cost time that should have gone toward the actual feature. No validation library was specified, so Copilot picked its own approach, and no tests were written, meaning correctness was never actually verified — the form *looked* done but its reliability was unknown.

## Round 2 — Precise Prompt
**Prompt:** Specified exact fields, chose react-hook-form + zod for validation, defined validation rules per field, required inline errors, a disabled-while-invalid Save button, a mock async save, accessibility requirements (label/htmlFor, aria-invalid), Tailwind styling, and a verification step asking for unit tests.

Copilot produced exactly the scoped component (`SettingsForm.jsx`) plus a matching test file (`SettingsForm.test.jsx`), using react-hook-form + zod as instructed. When asked to install dependencies and run the tests, Copilot correctly detected the project used Vitest (not Jest), added a `vitest.config.js` for jsdom, adapted the tests accordingly (e.g. programmatically firing form submit to test validation while the Save button is disabled), and all tests passed on the first run.

## Diff comparison
`git diff round1-vague round2-precise -- src/` shows Round 2 introduces a single, scoped `SettingsForm.jsx` (155 lines) built around a zod schema and react-hook-form, versus Round 1's broader `App.jsx` covering multiple unrequested settings sections with no schema-based validation. Round 2 is also the only version with a test file — Round 1 has zero test coverage, so its validation logic was never actually checked, only visually assumed to work.

## Review effort and time
Round 1 felt faster to prompt (one sentence) but required no less review time — arguably more, since the extra unrequested sections (notifications, appearance) would need to be manually stripped out or justified before this could be considered "done." Round 2's prompt took longer to write, but the output needed almost no correction: the constraints did the work up front, and the test suite gave immediate confidence instead of requiring manual verification.

## AI mistake caught
In Round 1, Copilot never asked whether extra features (notification toggles, appearance controls) were in scope — it assumed a broader "settings" interpretation instead of a single profile form, which would have shipped unnecessary surface area if accepted as-is without review.

## Takeaway
Round 2 confirms the drill's core lesson: the vague round felt quick but produced unverified, over-scoped output; the precise round felt slower up front but delivered a correct, tested, narrowly-scoped component with near-zero review overhead.