---
name: ScanCount AI Identity
colors:
  surface: '#16111b'
  surface-dim: '#16111b'
  surface-bright: '#3d3741'
  surface-container-lowest: '#110c15'
  surface-container-low: '#1f1a23'
  surface-container: '#231e27'
  surface-container-high: '#2e2832'
  surface-container-highest: '#39323d'
  on-surface: '#eadfed'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#eadfed'
  inverse-on-surface: '#342e38'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#fbabff'
  on-secondary: '#580065'
  secondary-container: '#ae05c6'
  on-secondary-container: '#ffd8fd'
  tertiary: '#fabc4e'
  on-tertiary: '#432c00'
  tertiary-container: '#bd871a'
  on-tertiary-container: '#3a2600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#ffd6fd'
  secondary-fixed-dim: '#fbabff'
  on-secondary-fixed: '#36003e'
  on-secondary-fixed-variant: '#7c008e'
  tertiary-fixed: '#ffdead'
  tertiary-fixed-dim: '#fabc4e'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#16111b'
  on-background: '#eadfed'
  surface-variant: '#39323d'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  grid-gutter: 1.5rem
  container-padding: 2rem
---

## Brand & Style

The design system is engineered to bridge the gap between industrial precision and social energy. It targets a dual audience: warehouse operators requiring high-efficiency inventory tools and social backers participating in crowdfunding momentum. The emotional response is one of "Calculated Futurism"—where the UI feels fast, intelligent, and hyper-modern.

The visual style is a hybrid of **Glassmorphism** and **High-Tech Minimalism**. While the light mode maintains a clean, professional aesthetic for daylight operations, the dark mode utilizes deep space blues and vibrant neon accents to create a high-contrast environment that feels like a command center. This design system leans heavily into "The Glow"—using light as a functional signifier for AI detection and active states.

## Colors

This design system utilizes a high-chroma palette set against deep obsidian neutrals. The **Fluorescent Neon Purple** serves as the primary action color, representing AI intelligence and system-wide primary triggers. **Electric Magenta** is used for secondary actions and gamification milestones, creating a vibrant "warmth" within the cool tech environment.

For Dark Mode, surfaces are built on a deep slate base to prevent pure-black eye strain while maintaining maximum contrast for the neon elements. Light Mode flips this logic, using the same accent colors against a crisp, paper-white background, where neon glows are replaced by high-saturation borders and soft shadows to ensure legibility.

## Typography

The design system relies exclusively on **Inter** to maintain a utilitarian, Swiss-inspired clarity. Typography is treated as data; weights are used aggressively to differentiate between "Static Data" (Regular) and "AI Insights/Actions" (Semi-Bold/Bold).

Headlines use a tighter tracking and heavier weight to feel impactful and modern. Body text prioritizes readability with a generous line height. For the scanner interface and data-heavy tables, a slightly reduced font size with increased weight is used for labels to maximize information density without sacrificing the high-tech aesthetic.

## Layout & Spacing

This design system uses a **Fluid 12-Column Grid** designed for density and dashboard efficiency. The spacing rhythm is based on a 4px baseline, ensuring all components align to a mathematical grid. 

Margins and gutters are generous (24px/1.5rem) to allow the "Glass" card components to breathe and to prevent the neon glows from overlapping visually. The dashboard uses a "sidebar-persistent" layout where the content area fluidly expands, but card widths are constrained to logical spans (e.g., 3, 4, 6, or 12 columns) to maintain a structured, organized feel.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Light Emission**. 

1.  **Surfaces:** In Dark Mode, cards use a `backdrop-filter: blur(12px)` with a semi-transparent border (1px white at 10% opacity). This creates a sense of physical layers floating over the deep blue background.
2.  **Focus States:** Depth is not indicated by shadow, but by "Glow." Active inputs or focused cards emit a 15px outer blur of the Primary Purple color.
3.  **Tiering:** Lower-level elements use solid, flat fills. Mid-level elements use glass transparency. Top-level elements (modals/popovers) use higher transparency with a subtle inner-glow to appear closer to the user.

## Shapes

The design system adopts a **"Soft Geometric"** approach. A consistent **12px (0.75rem)** radius is applied to all primary containers, cards, and buttons. This radius strikes a balance between the "friendliness" of social crowdfunding and the "structure" of enterprise software.

Smaller elements like chips or badges utilize a pill-shape (full rounding) to contrast against the more structural card shapes. AI bounding boxes in the scanner interface are the exception—using sharp corners with 4px "bracket" extensions at the corners to emphasize technical precision.

## Components

### Buttons
- **Primary:** Solid Purple Neon gradient. On hover, the `box-shadow` increases its glow intensity. Text is white for maximum contrast.
- **Secondary (Ghost/Outline):** 1px purple border with a subtle magenta tint on hover. Background remains transparent to maintain the glass aesthetic.
- **Danger:** High-saturation red with a soft red outer glow on hover.

### Inputs & Tenant Switcher
- **Inputs:** Dark slate background with a 1px border. On focus, the border transitions to Purple Neon, and a soft glow is applied.
- **Tenant Switcher:** A glassmorphic dropdown with a "Pulse" icon next to the active organization name, emphasizing the multi-tenant nature of the SaaS.

### Dashboard & Gamification
- **Cards:** Feature "Progress Bars" using a dual-gradient (Purple to Magenta). The "fill" of the bar should have a 4px outer glow to look like a light-tube.
- **Ranking Podiums:** Use vertical gradients with 10% opacity fills and 100% opacity top-borders. The #1 spot features a Magenta glow, while #2 and #3 use Purple.

### Scanner Interface
- **AI Bounding Boxes:** 2px stroke using the Primary Purple. Corners are reinforced with "L" shaped brackets. Real-time data labels float above the box in a pill-shaped glass badge.