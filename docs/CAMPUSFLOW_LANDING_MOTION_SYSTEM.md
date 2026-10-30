# CampusFlow V4 — Cinematic Landing Page Motion System
## High-Fidelity Physics, Emil Kowalski Restraint & Reduced-Motion Accessibility
### Hackathon Problem HACK-P410 | Google Antigravity

---

## 1. Motion Philosophy

The motion system for CampusFlow V4 is engineered around the principles articulated by Emil Kowalski and Apple product storytelling:

1. **Restraint Over Spectacle**: Motion is an informational signal, not decorative entertainment. Every animation indicates state transition, spatial hierarchy, or algorithmic evaluation.
2. **Sub-300ms Duration Budget**: All UI transitions resolve within 150ms – 250ms, never leaving the user waiting.
3. **Hardware Acceleration**: Only `transform` (`translate3d`, `scale`, `rotate`), `opacity`, and `filter blur` are animated. Layout properties (`top`, `left`, `width`, `height`, `margin`, `padding`) are strictly avoided during continuous animation to guarantee 60fps/120fps with zero layout thrashing.
4. **Active State Tactile Physics**: Interactive controls feature subtle physical compression (`scale(0.97)` / `scale(0.95)`) on click or touch.
5. **Accessibility by Default**: Every scripted or CSS animation respects `prefers-reduced-motion: reduce`, gracefully degrading to static high-contrast displays.

---

## 2. Timing & Easing Curves

```css
/* Emil Kowalski Spring Easing tokens */
--ease-out-spring: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--duration-fast: 150ms;
--duration-normal: 220ms;
--duration-stage: 280ms;
```

| Token / Type | Duration | Easing | Applied Components |
| :--- | :--- | :--- | :--- |
| **Tab / Role Switch** | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `RoleShowcaseStage.tsx` |
| **Active Tactile Press** | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Buttons, Chips, Stage Cards |
| **Interactive Scrub Rail** | `180ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `ApplicationJourneyTimeline.tsx` |
| **Eligibility Pulse** | `300ms` | `ease-in-out` | `EligibilitySandbox.tsx` |
| **Canvas Inertia** | Continuous | `dPos += (target - dPos) * 0.08` | `HeroCoreCanvas.tsx` |

---

## 3. Component Motion Architecture

### A. The Orbit Core Canvas (`HeroCoreCanvas.tsx`)
- **Physics**: Pointer movement updates a target coordinate; the canvas calculates an exponential spring decay ($v_{t+1} = v_t + (v_{\text{target}} - v_t) \times 0.08$), producing silky, inertia-damped orbital shifts.
- **Particle System**: 40 shimmering node particles travel along 3 concentric orbital rings (110px, 170px, 230px radii) at alternating angular velocities.
- **Power & Performance**: Monitored via an `IntersectionObserver`. When scrolled out of the active viewport, the `requestAnimationFrame` loop halts immediately, saving CPU and GPU cycles.
- **Reduced Motion**: If `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is detected, orbital rotation speed drops to 0 and render loops pause.

### B. Role Showcase Stage (`RoleShowcaseStage.tsx`)
- **Crossfade Physics**: When switching between Student, Recruiter, and Admin stages, the inactive panel smoothly compresses to `scale(0.99)` with `blur(2px)` and `opacity: 0.4` before the new stage cleanly expands to `scale(1)` with `blur(0)` and `opacity: 1` in 180ms.
- **Zero CLS Guarantee**: The parent container maintains equal minimum heights across all three roles, preventing content hopping.

### C. Live Eligibility Algorithm Simulator (`EligibilitySandbox.tsx`)
- **Instantaneous React State Reactivity**: Adjusting the CGPA slider or toggling branch buttons recalculates the eligibility vector on every tick ($0\text{ms}$ delay), matching the exact algorithmic logic of PostgreSQL RPC `evaluate_job_eligibility()`.
- **Dynamic Status Indication**: The status card cross-fades between emerald (`Eligible to Apply`) and rose (`Ineligible for Job`) with smooth color-border interpolations.

### D. Continuous Segmented Journey Rail (`ApplicationJourneyTimeline.tsx`)
- **Apple-Style Timeline Rail**: Replaced isolated card buttons with a single continuous progress track.
- **Interactive Stage Scrubbing**: Clicking any stage updates the dossier record in 180ms without page reloads.

---

## 4. Accessibility & Zero-FAIL Compliance

- **No Strobe or Flash**: Ambient background radials utilize low-opacity gradients ($< 15\%$) with large blur radiuses ($> 64\text{px}$).
- **Reduced Motion Support**:
  ```tsx
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Disable requestAnimationFrame loops, freeze canvas particles
  }
  ```
- **Audited with `inspect.mjs`**: Passed all CDP viewport inspection checks with 0 failures across 1440px desktop, 768px tablet, and 390px mobile viewports.
