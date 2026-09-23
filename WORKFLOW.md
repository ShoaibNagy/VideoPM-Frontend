# WORKFLOW.md

## What's being compared

`login-page` (`759b483`) and `signup-page` (`0e486f5`) are two real feature
branches from this repo, not a vague-vs-precise rebuild of the same page.
`login-page` is the foundational commit — it introduces routing, the theme
system, design tokens, `Logo`/`ThemeToggle`, and the login form in one pass:
21 files, 1,419 insertions, 420 deletions. `signup-page` is a pure add-on
built on top of that: 3 files, 755 insertions, 1 deletion — just
`RegistrationPage.tsx`, its SCSS module, and an 8-line `App.tsx` route
change. That structural difference — a from-scratch foundational build vs.
an additive build on an already-established pattern — is the real lesson
here, so the comparison follows it instead of pretending these are the same
feature done twice.

## Correctness

Both branches build (`tsc -b && vite build`) and lint clean on their own —
verified independently with `npm run build` / `npm run lint` on each. But
`RegistrationPage.tsx` silently drops a field the design specifies:
`UI-UX Design/Registration Page/index.html` (and its `scripts.js`) define a
required `teamName` ("Team or studio name") input with its own validation
rule; the shipped component's input IDs are `fullName`, `email`, `password`,
`terms` only — `teamName` and `teamNameError` never made it in, while the
copy still promises a team workspace ("You'll be the first member — invite
the rest of your team"). That's a real defect against the design, not a
style nit, and a green build/lint doesn't catch it — it only shows up by
diffing the component's field list against the design file directly.

## Accessibility

Both pages replicate the design's pattern correctly: per-field
`aria-describedby` wired to error `<p>` elements, `aria-invalid` toggled on
real invalid state rather than every keystroke, and the password-requirements
list uses the design's visually-hidden "Met:"/"Not yet met:" prefix instead
of a chatty `aria-live` region — checked against `scripts.js`'s intent, not
just the CSS. Neither branch regresses this.

## Edge cases

`signup-page` correctly ports the multi-rule password check
(`passwordMeetsAllRules`) and composes two IDs into one `aria-describedby`
(`passwordRequirementsId` + `passwordErrorId`), which `login-page` doesn't
need since it has no password rules. Both focus the first invalid field on a
failed submit identically.

## Review effort

`login-page`'s commit is the expensive one to review: it mixes infra
(tokens, theme provider, routing) with a feature, deletes two legacy CSS
files, and touches 21 files — a reviewer has to verify plumbing and UI in
the same pass. `signup-page` is close to a one-glance review: new folder, no
deletions, an 8-line route diff (plus one stray blank-line-with-trailing-
whitespace in that diff). The missing `teamName` field is the one thing that
quick pass wouldn't catch without opening the design file side-by-side —
which is exactly why that check is now a rule (see updated `CLAUDE.md`).

## v0 comparison

I don't have a way to drive v0.app from here — it's an interactive, account-gated web tool with no API connector available in this environment, so I can't generate output myself and I'm not going to fabricate a diff against code I never ran. What I can do honestly:

**Prompt to paste into v0**, scoped to match this design rather than v0's defaults:

> Build a two-column registration page: left panel is a solid-color brand panel with a headline, supporting copy, and a 3-item benefit list; right panel is a centered form (max-width ~24rem) with Full name, Work email, Team/studio name, and Password fields, a live password-requirements checklist (8+ characters, contains a number) that updates as you type, a show/hide password toggle, a Terms-of-Service/Privacy-Policy checkbox, a submit button, and a "Already have an account? Log in" link. WCAG AAA contrast. Collapse to a single column with the form only below 900px.

**What to expect it to diverge on, based on v0's documented defaults** (not something I observed running it): v0 defaults to Next.js + Tailwind + shadcn/ui and controlled `useState`-per-field forms, not this repo's Vite + React Router + CSS-Modules-with-design-tokens setup — so its output won't compile as-is against `App.tsx`'s lazy-route pattern or `_tokens.scss`, and accessibility wiring (`aria-describedby`, focus-on-first-invalid-field, the visually-hidden requirement-status prefixes) has to be prompted for explicitly since it isn't v0's default behavior. It does support a custom design-system registry if you want output that uses this repo's actual tokens instead of Tailwind's.

If you paste v0's generated component back here, I'll diff it against `RegistrationPage.tsx` the same concrete way as the branch comparison above, rather than guessing.