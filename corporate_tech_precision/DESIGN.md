---
name: Corporate Tech Precision
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#42474e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#72777f'
  outline-variant: '#c2c7cf'
  surface-tint: '#386188'
  primary: '#002743'
  on-primary: '#ffffff'
  primary-container: '#0a3d62'
  on-primary-container: '#80a8d3'
  inverse-primary: '#a2caf7'
  secondary: '#005cab'
  on-secondary: '#ffffff'
  secondary-container: '#0075d6'
  on-secondary-container: '#fefcff'
  tertiary: '#1d262d'
  on-tertiary: '#ffffff'
  tertiary-container: '#323c44'
  on-tertiary-container: '#9ca6af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#a2caf7'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#1d496f'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a5c8ff'
  on-secondary-fixed: '#001c3a'
  on-secondary-fixed-variant: '#004786'
  tertiary-fixed: '#dae4ee'
  tertiary-fixed-dim: '#bec8d1'
  on-tertiary-fixed: '#131d24'
  on-tertiary-fixed-variant: '#3e4850'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  xxl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

The brand personality of this design system is rooted in technical authority, precision, and architectural stability. It is designed to position the company as a high-tier IT partner that balances legacy reliability with future-forward innovation. The target audience includes enterprise stakeholders, CTOs, and tech-driven entrepreneurs who value clarity over clutter.

The aesthetic follows the **Corporate / Modern** movement. It utilizes structured layouts, intentional whitespace, and a high-contrast interaction model to evoke a sense of professional competence. Every element serves a functional purpose, avoiding unnecessary ornamentation in favor of crisp execution and high-tech elegance.

## Colors

The palette is anchored by a deep Primary Blue, conveying depth and institutional trust. This is contrasted by a Secondary Blue used exclusively for interactive elements and accents to guide the user's eye. 

- **Primary Blue (#0A3D62):** Used for headers, primary brand moments, and high-level navigation.
- **Secondary Blue (#1E90FF):** Reserved for call-to-actions, link states, and vital indicators.
- **Background (#F4F8FB):** A cool-toned light grey that reduces eye strain and provides a premium alternative to pure white.
- **Text (#1B1B1B):** A near-black for maximum legibility and professional contrast.
- **Accent (#E6F0FA):** Used for subtle section highlighting and soft container backgrounds.

## Typography

This design system utilizes **Manrope** as its core typeface to achieve a balance between geometric modernity and corporate readability. Its open counters and refined weights ensure that technical data remains accessible and legible. 

Headlines utilize tighter letter spacing and heavier weights to project confidence. Body copy is set with generous line heights to facilitate long-form reading of service descriptions and technical documentation. **Inter** is employed for utility labels and UI elements where systematic, neutral clarity is paramount.

## Layout & Spacing

The layout is built upon a **12-column fixed grid system** that centers on the screen for desktop views, ensuring content remains structured and focused. A generous spacing rhythm, based on an 8px scale, is used to prevent visual density and emphasize a "clean" agency feel.

- **Grid:** 12 columns with 24px (1.5rem) gutters.
- **Section Padding:** Large vertical gaps (xxl) are used between major content blocks to allow the design to "breathe."
- **Alignment:** All elements must snap to the grid; text containers should generally span 6 to 8 columns for optimal reading width.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers**. Instead of harsh borders, surfaces use soft, diffused shadows with a slight blue tint (`rgba(10, 61, 98, 0.08)`) to maintain the tech-centric aesthetic.

- **Low Elevation:** Used for cards and secondary buttons. A subtle 4px blur with minimal offset.
- **High Elevation:** Used for modals, dropdowns, and the sticky header. A 12px blur that creates a floating effect.
- **Tonal Layers:** The accent color (#E6F0FA) is used to create "wells" or background sections that sit behind cards, providing depth without the need for complex drop shadows.

## Shapes

The shape language is consistently **Rounded (Level 2)**. This approach softens the industrial feel of an IT company, making the interface feel modern and user-friendly. 

- **Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Cards & Large Containers:** 1rem (16px) corner radius.
- **Icons:** Should feature slightly rounded terminals to match the container radius. 

Sharp corners are avoided to prevent the UI from appearing dated or overly aggressive.

## Components

### Buttons
Primary buttons feature a subtle vertical gradient from Secondary Blue (#1E90FF) to a slightly deeper shade, or a solid Primary Blue fill. Hover states involve a slight lift (elevation increase) and a brightness shift. Secondary buttons use the Accent Blue (#E6F0FA) with Primary Blue text.

### Cards
Cards are the primary content vehicle. They must have a white background, a 1px border in the accent color, and a subtle ambient shadow. On hover, the shadow intensifies slightly to indicate interactivity.

### Sticky Header
The header remains fixed at the top of the viewport. It utilizes a high-elevation shadow and a semi-transparent background (Glassmorphism) with a background blur effect (backdrop-filter: blur(10px)) to ensure content scrolling underneath is visible but not distracting.

### Inputs & Forms
Input fields use a 1px border in a lightened version of the Primary Blue. On focus, the border transitions to Secondary Blue with a soft glow effect.

### Chips & Tags
Used for service categories or tech stacks, these are small, pill-shaped elements with the Accent Blue (#E6F0FA) background and Primary Blue text.
