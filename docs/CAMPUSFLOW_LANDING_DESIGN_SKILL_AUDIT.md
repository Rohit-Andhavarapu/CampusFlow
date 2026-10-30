# CAMPUSFLOW — CINEMATIC LANDING PAGE DESIGN SKILL AUDIT
**Google Antigravity | Hackathon HACK-P410 | Architecture & Design Directive**

---

## 1. Exact Files Studied

### Skill A — Impeccable (`.agent/skills/impeccable/`)
- `SKILL.md` — Core design principles, four surface modes (Persuade, Operate, Read, Experience), command routing, design authority.
- `reference/craft-floor.md` — Quality floor, verification checklists (contrast, depth, spacing, type, motion, browser surfaces, copy), and absolute bans.
- `reference/mode-persuade.md` — Persuade rules, non-template page scaffolding, single-object composition, offer readability.
- `reference/animate.md` — Motion thesis, focal moment vs supporting states, visitor mode pacing, runtime optimization, reduced-motion paths.
- `reference/layout.md` & `reference/craft.md` — Visual rhythm, typography scales, tight grouping, generous section separation.

### Skill B — Emil Kowalski Design Engineering (`.agents/skills/emil-design-eng/`)
- `SKILL.md` — Complete document: The Animation Decision Framework (frequency, purpose, custom easing curves, duration under 300ms for UI, perceived performance), Spring animations, component building principles (`:active` `scale(0.97)`, never animate from `scale(0)`, origin-aware popovers, delay skipping), CSS transform mastery (percentage translates, `preserve-3d` orbital depth), `clip-path` reveals, gesture velocity, performance rules (only animate transform/opacity, CSS vs main-thread JS), accessibility (`prefers-reduced-motion`, hover media query), and the Sonner principles.

### Skill C — Taste Skill / Design-Taste-Frontend (`.agents/skills/design-taste-frontend/`)
- `SKILL.md` — Anti-slop thesis, 247-site study findings, Page vs App distinction, the subject inventory, claim-driven section structure, directional choices, finding the single authentic idea, copy arithmetic ($\le 2$ lines per headline, 32 characters median), "One Live Thing" rule, building still first before motion.
- `references/copy.md` — Headline density, supporting sentence placement, direct proof over marketing rhetoric.
- `references/app-screens.md` — Embedding real product interface fragments with honest data and crisp typography.

---

## 2. Core Principles Extracted from Each Skill

| Skill | Principle | Concrete Meaning |
| :--- | :--- | :--- |
| **Impeccable** | **Persuade Surface Mode** | The landing page is not an app; design is what the visitor judges. The visual world must own the ground, materials, and type with full commitment. |
| **Impeccable** | **Craft Floor Bans** | **Banned**: Eyebrows/kickers above headlines. **Banned**: Same-size 3-card icon grids. **Banned**: Metric cards template. **Banned**: Decorative glassmorphism / zero-blur block shadows. |
| **Impeccable** | **Browser Surface Theming** | Theme the parts you didn't draw: `::selection`, focus rings, caret color, and scrollbar must belong to the palette (`#0F766E` / `#72F4D1`). |
| **Emil Kowalski** | **Animation Decision Framework** | Ask: Frequency, Purpose, Custom Easing, Speed. UI transitions $\le 300\text{ms}$. Never use `ease-in` for interface feedback. |
| **Emil Kowalski** | **Custom Easing Curves** | Use strong cubic beziers: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`. |
| **Emil Kowalski** | **Button Physics & Microinteractions** | `scale(0.97)` on `:active` with `160ms ease-out`. Never animate from `scale(0)` (start from `scale(0.95); opacity: 0`). |
| **Emil Kowalski** | **Subtle Blur Crossfading** | Add `filter: blur(2px)` during state swaps to blend transitions and eliminate jarring cuts. |
| **Emil Kowalski** | **Performance & GPU Isolation** | Animate strictly `transform` and `opacity`. Prefer CSS hardware-accelerated transforms over main-thread JavaScript loops. |
| **Taste Skill** | **Anti-Slop House Style** | Replace model defaults (3 generic cards, purple gradients, floating badges) with subject-specific decisions. |
| **Taste Skill** | **Idea from the Subject** | The recruitment core: 4 intersecting vectors (Students, Opportunities, Recruiters, Placement Teams) driving career acceleration. |
| **Taste Skill** | **One Live Thing** | An interactive element the visitor can manipulate: an interactive Recruitment Core Inspector / Live Eligibility Sandbox. |
| **Taste Skill** | **Build It Still First** | Ensure the layout, typographic hierarchy, and visual balance are structurally sound before adding scroll choreography. |

---

## 3. How Each Principle Influences the CampusFlow Landing Page

1. **Editorial Architecture Without Kickers**:
   - Every headline stands independently without pre-heading badges or category kickers (e.g., "Your Future. In Motion.", not "NEXT-GEN PLATFORM // YOUR FUTURE IN MOTION").
2. **Apple-Caliber Product Choreography**:
   - The product reveal section begins as a floating dark-mode holographic perspective that smoothly converges and levels into the real CampusFlow workstation, transitioning deliberately from deep-space obsidian into the crisp white workspace.
3. **Original Sci-Fi Recruitment Core**:
   - A hardware-accelerated Canvas/SVG interactive core featuring 4 nodes: `STUDENT CANDIDATES`, `VERIFIED OPPORTUNITIES`, `EMPANELLED RECRUITERS`, and `INSTITUTIONAL PLACEMENT OFFICE`.
   - Responds to pointer position with momentum springs (`stiffness: 120, damping: 14`) and scroll depth.
4. **Three Worlds Interactive Stage**:
   - Replaces side-by-side cards with a single interactive perspective stage. Selecting **Student**, **Recruiter**, or **Administrator** shifts the stage with custom easing, displaying real interactive fragments of the actual application.
5. **Explainable Eligibility Sandbox ("One Live Thing")**:
   - Visitors can toggle student credentials (CGPA, Branch, Backlogs, Skills) and instantly watch the explainable criteria rule engine evaluate eligibility against real company cutoffs in real time.
6. **Career Progression Timeline**:
   - An interactive lifecycle line tracing `Submitted` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview` $\rightarrow$ `Selected`, alongside alternate branch handling (`Withdrawn` / `Declined`).
7. **Themed Browser Surfaces**:
   - `::selection` styled in luminous mint tint (`background: #0F766E33; color: #72F4D1`), customized dark scrollbars, and teal focus rings (`ring-teal-500/40`).

---

## 4. Inapplicable Principles & Why

1. **Print / Ephemera Motifs (Taste Skill)**:
   - Taste Skill suggests paper slips, postage stamps, or museum archival cards for artisan businesses. CampusFlow is a futuristic, cinematic, high-density recruitment workstation. Applying paper menus or vintage postcards would conflict with the Apple/Linear tech aesthetic.
2. **Neobrutalist Hard Block Shadows**:
   - Impeccable explicitly bans `4px 4px 0` offset shadows unless the world is neobrutalist. CampusFlow uses deep ambient offsets with soft blur gradients (`0 20px 50px -10px rgba(0,0,0,0.7)`).
3. **Shared Layout Animations on Page Load (Emil Kowalski warning)**:
   - Emil noted that heavy Framer Motion shared layout transitions cause frame drops during initial page loading. We use CSS transforms and isolated canvas contexts for the landing page.

---

## 5. Section-by-Section Motion Strategy

| Section | Element | Motion Technique | Easing & Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **01. Hero** | Recruitment Core | Multi-layered interactive canvas with orbital depth | Momentum spring (`useSpring`, 60fps) | Visual anchor; establishes connected ecosystem |
| **01. Hero** | Floating Telemetry Chips | Subtle 3D floating fragments | CSS `translate3d`, 6s infinite ease-in-out | Depth & sensory liveliness |
| **01. Hero** | CTAs | Press scale + luminous hover boundary | `scale(0.97)`, 160ms ease-out | Responsive tactile feedback |
| **02. Transformation** | Convergence Sequence | Scatter-to-order convergence | Scroll-driven transform (`translateY`, `scale`) | Illustrates chaos to clarity |
| **03. Three Worlds** | Role Showcase Stage | Perspective stage transition + clip-path | `cubic-bezier(0.23, 1, 0.32, 1)`, 280ms | Spatial continuity across roles |
| **04. Product Reveal** | Dashboard Inset | 3D pitch/yaw tilt leveling to frontal plane | Scroll progress interpolation | Apple-style hardware product unveil |
| **05. Eligibility Engine** | Criteria Verification | Checkmark pulse + progress fill | 220ms ease-out | Transparent rule validation |
| **06. Application Journey** | Lifecycle Progress Line | Luminous particle pulse along timeline | CSS keyframe trace, 1.8s | Career progression momentum |
| **07. Connected Ecosystem**| Node Network Flow | Dynamic SVG bezier connection paths | Continuous ambient pulse | Institutional scale & reach |
| **08. Final Call to Action**| Luminous Horizon | Expanding ambient glow on scroll entry | 500ms ease-out | Cinematic conclusion |
| **09. Footer** | Directory Navigation | Clean fade-up on viewport entry | 200ms ease-out | Quiet, stable exit |

---

## 6. Accessibility & Performance Constraints

1. **Reduced Motion (`prefers-reduced-motion: reduce`)**:
   - When active, all 3D rotations, canvas particle flows, and scroll transforms are frozen or converted to gentle opacity crossfades.
2. **WCAG 2.2 AA Contrast**:
   - Large headlines: Silver white (`#F5F7FA`) on Obsidian (`#060B12`) gives contrast $> 14:1$.
   - Body copy: Muted silver slate (`#94A3B8`) on dark background gives contrast $> 5.8:1$.
   - Interactive accents: Luminous mint (`#72F4D1`) on dark background gives contrast $> 9:1$.
3. **GPU Isolation**:
   - Canvas elements render to an offscreen buffer or isolated layer.
   - Animated elements use `will-change: transform` only during active scroll/interaction.
   - All animations avoid triggering layout or paint (no animating `width`, `height`, `margin`, or `top`).
4. **Mobile Performance**:
   - Particle counts and 3D tilt effects automatically step down on mobile viewports ($\le 768\text{px}$) to conserve battery and guarantee 60fps.

---

## 7. Anti-Generic Design Checklist

- [x] **No kickers/eyebrows**: Every section headline stands boldly on its own without tiny category labels.
- [x] **No 3-card feature columns**: Replaced by an interactive pinned three-role showcase stage.
- [x] **No generic SaaS gradients**: Deep space obsidian, silver-white typography, precision teal, and luminous cyan accents.
- [x] **No placeholder numbers**: Real data structures, real student roll numbers, real company names (NovaTech, Orbit, AgNext), real CGPA cutoffs.
- [x] **No stock icons in pastel squares**: Custom SVG symbols and real interface typography.
- [x] **No template hero**: Custom interactive recruitment core canvas reacting dynamically to visitor input.
- [x] **Real authentication transition**: Seamless movement from cinematic dark marketing into the crisp, light Framed-Sheet recruitment workstation.
