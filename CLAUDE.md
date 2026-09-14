# Frontend — Professional Video Editor

Cloud-native NLE in the browser. Desktop editing is a dense multi-panel workspace (media, canvas/preview, timeline, inspector). Marketing and account surfaces are separate and must stay light.

Stack: React 19 + React Compiler, Vite, TypeScript, SCSS. Motion **or** GSAP for UI motion (pick one before shipping chrome animations; see below). NestJS API lives in `../backend`.

## Product constraints

- Dark NLE chrome. Surfaces ≈ `#121212` / `#1E1E1E`, text ≈ `#E0E0E0`. Avoid pure `#000` backgrounds (halation). Focus rings ≥ 3:1, 2px. Target WCAG 2.2 AAA on chrome; 7:1 for UI text.
- Timeline is spatial **and** must have a non-pointer path: keyboard trim/nudge, numeric in/out, and a list or transcript view. Do not ship drag-only editing.
- Preview and timeline are hot paths. Export/render is server-side; the client must not freeze the main thread encoding.
- Editor layout: left media, center preview, bottom timeline, right properties. Panels reflow with **container queries**, not only viewport breakpoints. Marketing pages are fully responsive; the editor may simplify on small screens (bottom nav / floating panels), not a shrunk 4-column grid.
- Time in edit logic is integer **frames** (plus project fps) or integer microseconds. Never use floating-point seconds as the source of truth for cuts, durations, or playhead snap.

## React Compiler

Compiler is on (`babel-plugin-react-compiler` via Vite). Write for it:

- Default to plain functions, derived values, and event handlers. Do **not** add `useMemo`, `useCallback`, or `React.memo` unless a profiler or the compiler bailout proves you need them.
- Keep components pure. No mutating props, state, or values that will be rendered. No hidden writes during render.
- Do not put refs, Maps, or class instances in render output unless they are stable identities created correctly.
- If the compiler bails out, fix the impurity. Do not silence it with `"use no memo"` except as a last resort on a documented island (canvas/WebGL host).
- Prefer local state and props. Lift only when siblings share. For editor document state (tracks, clips, selection, in/out), use one dedicated store—not a web of `useState` in layout components.

## What must not go through React at 60fps

Playhead position during playback, waveform/thumbnail scroll, and canvas redraws are **not** React state.

- Drive them with refs + rAF, a canvas/WebGL/video element, or the animation library’s ticker.
- React state updates on seek **commit**, selection change, clip mutate, and pause—not on every frame.
- Split: `EditorChrome` (React) vs `PreviewSurface` / `TimelineCanvas` (imperative hosts). Pass project fps, sequence duration, and clip layout as props/snapshots; mutate the host from a player clock.

## TypeScript

- `verbatimModuleSyntax` is on: `import type` for types only.
- Model the sequence explicitly: `Clip`, `Track`, `Transition`, `Marker`, in/out in frames. Union-discriminate clip kinds (video, audio, title, adjustment).
- IDs are branded strings. Do not use array index as identity.
- No `any`. Narrow DOM/`<video>` and pointer events at the boundary.

## Vite

- Code-split marketing, auth, dashboard, and editor. The editor chunk must not load into the landing page.
- Put WASM, ffmpeg-ish, and heavy waveform/decoder work behind dynamic `import()`.
- Static media in `src/assets` or `public` as appropriate; never block LCP with editor-only fonts or workers.

## SCSS

- Colocate: `Component.tsx` + `Component.module.scss` (CSS modules). Shared tokens in `src/styles/` (`_tokens.scss`, mixins).
- Design tokens as CSS custom properties (colors, focus, track heights, z-index layers: chrome < preview < overlays < modals).
- No global class soup. Globals only for reset, tokens, and editor shell grid.
- Prefer container queries on panels. Use `transform`/`opacity` for motion; do not animate `width`/`left` on every playhead tick.
- Keep specificity flat. Nest at most one level in modules.

## Motion vs GSAP (undecided)

Use **one** library for product UI (menus, panels, toasts, onboarding). Do not mix them.

| Use | Motion (`motion`) | GSAP |
| --- | --- | --- |
| Panel chrome, overlays, presence | First choice (`AnimatePresence`, layout if needed) | Fine, but heavier |
| Timeline/playhead/canvas | Do **not** | Do **not** as the clock; optional for one-shot UI on clips |
| Scrub-linked, keyframed, complex sequences | Weak fit | Better if we ever animate along the sequence UI itself |
| React Compiler | Keep animated nodes as refs; avoid reading animated values in render | `useGSAP` + `gsap.context`; tween DOM/canvas, not React state |

Until a choice is committed in `package.json`:

- Do not add both dependencies.
- Prefer CSS/`@media (prefers-reduced-motion)` for small hover/focus motion.
- If implementing a feature that needs a lib, pick **Motion for UI chrome** or **GSAP for complex sequenced UI**, then record the decision here and stick to it.

Always honor `prefers-reduced-motion: reduce` (instant or opacity-only).

## Editor implementation rules

- Keyboard: play/pause, frame step, j/k/l or equivalent, split, ripple delete, snap toggle, nudge. Document shortcuts in one module; keep them out of random `onKeyDown` handlers.
- Pointer capture on timeline drags; pointerleave must not drop capture.
- Snap and magnetic edges live in the time/geometry helpers, not in the component.
- Undo/redo is command-based on document mutations, not “setState to previous UI”.
- Selection, marquee, and in/out are first-class; do not infer them from CSS.
- `<video>`/`<audio>` are players, not the source of truth. The clock owns time; media elements follow.
- Thumbnails, proxies, and waveforms are async resources with cancellation; do not store Object URLs without `revokeObjectURL`.

## Accessibility

- Every timeline operation has a keyboard and a numeric/form equivalent.
- Focus is visible on clips, playhead controls, and panel tabs. Roving tabindex inside tracks.
- Do not rely on color alone for track type or clip warnings.
- Marketing/help video: captions (VTT). Editor UI copy is not baked into the canvas without a DOM/ARIA duplicate.

## Files and scope

- This package is the SPA only. Do not “fix” NestJS in this repo unless asked.
- Do not rewrite `README.md` or expand scope into programmatic SEO tool pages unless the task says so.
- When adding routes later: public marketing vs authenticated dashboard vs `/editor/:projectId` as separate layouts.

## Commands

- `npm run dev` — Vite
- `npm run build` — `tsc -b` + Vite
- `npm run lint` — ESLint
