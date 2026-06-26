---
name: City Intelligence Architecture
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for high-stakes urban decision-making, blending institutional reliability with futuristic precision. It targets government officials, urban planners, and enterprise investors who require a platform that feels both authoritative and cutting-edge.

The aesthetic is a fusion of **Precision Minimalism** and **Functional Glassmorphism**. Drawing inspiration from aerospace interfaces and high-end hardware, the UI prioritizes clarity, depth, and intentionality. By utilizing "Apple-inspired" white space and "Vercel-like" geometric rigor, the design system creates an environment of "Institutional Trust." It evokes the feeling of a sophisticated digital twin—highly technical yet effortlessly navigable.

## Colors

The palette is anchored in a high-luminosity foundation to maintain a clean, clinical feel. 

- **Primary (Action Blue):** Used for critical paths, primary buttons, and active states. It represents the "intelligence" layer of the platform.
- **Secondary (Data Cyan):** Specifically reserved for data visualization, telemetry, and secondary signals. It provides a technical contrast to the primary brand color.
- **Surface & Background:** We utilize a dual-tone light strategy. `#F8FAFC` acts as the canvas, while `#FFFFFF` surfaces are elevated via shadows and glass effects to create clear information architecture.
- **Semantic Colors:** Success, Warning, and Danger are calibrated for high legibility against white backgrounds, ensuring immediate recognition of urban alerts or system statuses.

## Typography

This design system utilizes **Inter** for its systematic, neutral, and highly legible characteristics. The typographic hierarchy is designed to handle dense data while maintaining a "premium editorial" feel.

- **Display & Headlines:** Use tight letter spacing and bold weights to create a sense of strength.
- **Labels:** Small caps or increased tracking are used for metadata and category headers to distinguish them from actionable body text.
- **Monospacing:** While Inter is the primary face, JetBrains Mono (or a similar system mono) should be used sparingly for coordinates, ID numbers, and live sensor readings to reinforce the "City Intelligence" technical vibe.
- **Mobile Scaling:** Headlines above 30px should scale down by 20% on mobile devices to maintain layout integrity.

## Layout & Spacing

The layout philosophy follows a **Fluid Intelligence Grid**. It uses a 12-column system on desktop with generous gutters to allow the UI to breathe, mimicking the "Tesla UI" approach where information is grouped into distinct, logical clusters.

- **Grid:** 12 columns (Desktop), 8 columns (Tablet), 4 columns (Mobile).
- **Rhythm:** A strict 4px base unit ensures consistent alignment.
- **Density:** High-density layouts are permitted for data-dashboards, but must be balanced with significant "safe area" margins (24px - 32px) at the edges of the screen.
- **Adaptation:** On mobile, sidebars collapse into bottom sheets or "floating islands" to prioritize map or graph visibility.

## Elevation & Depth

Depth is used functionally to indicate the "z-index" of intelligence. We use a layered approach:

1.  **Canvas (Base):** `#F8FAFC`. The lowest level, representing the city map or background data.
2.  **Surface (Cards):** `#FFFFFF`. Used for containers. These feature a soft, multi-layered shadow (`0 4px 6px -1px rgb(0 0 0 / 0.05)`) and a subtle 1px border in `#E2E8F0`.
3.  **Glass (Overlays):** For modals and floating toolbars, use a background blur (`20px`) with 80% opacity. This suggests a "heads-up display" (HUD) feel common in high-tech simulation software.
4.  **Active Elevation:** When an element is interacted with, it should transition from a `shadow-sm` to a `shadow-lg` to simulate a physical "lift" toward the user.

## Shapes

The design system utilizes a signature **20px corner radius** for all primary containers and cards. This large radius softens the technical density of the data, making the platform feel approachable and "Apple-esque."

- **Primary Cards:** 20px radius.
- **Buttons & Inputs:** 12px radius (Softened for precision).
- **Small Components (Chips/Tags):** Fully rounded (Pill) to contrast with the structured grid of the cards.
- **Visual Rhythm:** Nested elements should have a radius that is 4px-8px smaller than their parent container to maintain geometric harmony.

## Components

- **Buttons:** Primary buttons use a solid Action Blue fill. Secondary buttons use a "Ghost" style with a 1px border or a subtle gray tint. All buttons feature a 150ms ease-in-out hover transition.
- **Glass Cards:** Containers for live metrics should use `backdrop-filter: blur(12px)` and a thin white inner-border (0.5px) to simulate light catching the edge of glass.
- **Inputs:** Fields are minimalist—no heavy borders. Use a soft `#F1F5F9` background that transitions to a white background with an Action Blue 2px ring on focus.
- **Data Visualizations:** Use "Data Cyan" and "Success Green" for trend lines. Charts should be borderless, utilizing whitespace to separate data series.
- **Chips/Status:** Use low-saturation backgrounds with high-saturation text (e.g., light cyan background with dark cyan text) for status indicators.
- **Transitions:** Every interaction should feel fluid. Use "Framer Motion" style spring physics (stiffness: 300, damping: 30) for modal entries and list reordering to mimic the premium feel of a high-performance OS.