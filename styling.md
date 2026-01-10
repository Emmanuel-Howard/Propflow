Propflow Backend Styling PRD
Objective

Redesign the backend of Propflow (everything beyond the landing website) to feel premium, professional, and seamless, akin to Harvey.ai, Klaviyo, or Stripe dashboards. Focus on clarity, hierarchy, spacing, and subtle visual cues, without overloading with colors or overly rounded components.

1. Color Palette
Role	Color	Notes
Primary Background	#FFFFFF (white)	Main canvas for the dashboard
Primary Text	#000000 (black, variable opacity allowed for muted text)	Default body text
Secondary Accent	Rich Green (Gradient: #083E33 → lower opacity)	Sparing usage; for highlights or progress indicators
Secondary Accent 2	Warm Gold	Sparing usage; subtle emphasis for key metrics/buttons
Background Variants	#F9F9F9, #FAFAFA	Subtle difference for sections/rows if needed

Rules:

White dominates; black is for readability; green & gold used only sparingly.

Avoid colored cards or panels that clash with the background.

Gradients optional on hover or subtle elements only.

2. Typography
Type	Font / Style	Notes
Headers	Professional Sans-Serif (e.g., Inter, Manrope, Poppins)	Bold hierarchy, clean lines
Subheaders / Labels	Same family, medium	Consistent spacing, smaller size
Body Text	Same family, regular	Muted opacities for secondary info
Monospace (if needed)	Fira Code, JetBrains Mono	Code or structured data display

Guidelines:

Maintain clear hierarchy with heading sizes: h1 > h2 > h3 > labels > body.

Consistent line heights and spacing.

Avoid decorative fonts; keep premium and professional.

3. Layout & Spacing

Use a grid system with clear margins/padding (e.g., Tailwind gap-6, px-6, py-4).

Section spacing should group related controls visually, without cards unless necessary.

Avoid over-rounded corners; minimal radius (4px–6px) for inputs/buttons.

Keep sidebars fixed and dashboards fluid with clear alignment.

Integrate charts and tables into page flow, not in “boxed bubbles”.

4. Components
Buttons

Primary: white background, black text, subtle shadow on hover. Optional gradient green for rare CTA.

Secondary: black text, transparent background, subtle hover underline or shadow.

Hover: smooth transition (transition-all duration-200 ease-in-out), slight scale or shadow.

Avoid flashy animations; clean, subtle, professional.

Inputs / Forms

Clear borders (#E0E0E0), slight rounding (4px).

Focus state: border accent (rich green or gold), subtle glow.

Group related inputs closely (law of proximity).

Tables / Charts

Integrated with page; no excessive background or card.

Subtle row hover highlight (opacity-10–20%).

Gridlines minimal, just enough for readability.

Chart colors align with primary palette; avoid unnecessary bright tones.

Cards / Panels

Minimal rounding; mostly white or transparent.

Only use shadows for subtle separation if needed.

Reserve cards for grouping logically related inputs.

5. Micro-interactions

Use hover effects selectively; not all buttons require hover.

Loading skeletons for tables or charts where data is dynamic.

Optimistic updates for forms and toggles.

Smooth transitions for modal slides or dropdowns.

6. UX Principles Applied

Design Principles to Follow

Law	Apply by…
Aesthetic Usability	Use spacing/typography to make forms feel easier
Hick’s Law	Avoid clutter; collapse complex settings
Jakob’s Law	Stick to familiar admin patterns (cards, sidebars, modals)
Fitts’s Law	Place important buttons close, large, clear
Law of Proximity	Group logic and inputs with spacing + layout components
Zeigarnik Effect	Use progress indicators, save states
Goal-Gradient	Emphasize progress in workflows
Law of Similarity	Ensure toggles, selectors, filters share styling and layout conventions

Implementation Details

Aesthetic-Usability Effect: Clean spacing (gap-2, px-4), typographic hierarchy, subtle shadows or separators.

Hick’s Law: Reduce visible options per screen; collapse advanced sections.

Jakob’s Law: Stick to admin conventions: table lists, modals, top bar placement, common icons.

Fitts’s Law: Important actions (edit, delete) large, clear, avoid tiny icon-only targets.

Law of Proximity: Group related inputs/components visually with containers.

Zeigarnik Effect: Show multi-step progress; save state feedback.

Goal-Gradient Effect: Highlight active steps; encourage completion with progress bars or steppers.

Law of Similarity: Keep toggles, buttons, badges, filters consistent in style and layout.

Miller's Law: Chunk complex configuration into steps or panels.

Doherty Threshold: Aim for sub-400ms interactions; use loading skeletons and spinners.

-
Font Families
MAKE IT LOOK SLEEK.
Primary (Sans-Serif): Inter

Secondary / Accents: Optional serif for headings or special sections (e.g., Playfair Display), sparingly.

Monospace (Code / Tables): Fira Code, JetBrains Mono – for structured data or code blocks.

Hierarchy & Sizes
Role	Font Size	Weight	Line Height	Usage
H1	36–40px	Bold	1.2	Main page titles, dashboard overview
H2	28–32px	Semi-Bold	1.3	Section headings
H3	22–26px	Medium	1.4	Sub-sections, group headings
Label / Small Heading	14–16px	Medium	1.5	Form labels, table headers
Body / Paragraph	14–16px	Regular	1.5	Default text, descriptions
Muted Text	12–14px	Regular	1.5	Secondary info, placeholders
Monospace	14px	Regular	1.4	Code blocks, structured data

Other notes:
- THIS SHOULD NOT LOOK LIKE AI.
