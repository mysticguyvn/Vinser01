---
name: Academic Vitality
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-bold:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built to balance the academic rigor of a student environment with the social energy of a modern networking hub. The brand personality is "The Trusted Connector"—providing a safe, structured space that encourages spontaneous collaboration and peer-to-peer growth.

The visual style follows a **Corporate / Modern** approach with a heavy emphasis on **Minimalism**. By prioritizing high-contrast typography and expansive whitespace, the interface reduces cognitive load, allowing student contributions to take center stage. The "vibrant" aspect is introduced through purposeful color accents and fluid motion, ensuring the platform feels alive and responsive rather than static or institutional.

## Colors

The color strategy for this design system utilizes a "Paper and Ink" philosophy. Backgrounds are kept to a clean, stark white or a very light cool gray to ensure maximum readability and a feeling of openness. 

- **Primary (Modern Indigo):** Used for primary actions, navigation states, and brand-level components to instill a sense of trust and professionalism.
- **Secondary (Fresh Teal):** Used for collaborative features, such as group icons, "join" buttons, and community-driven events.
- **Functional Accents:** A semantic system is used for tagging. Skills are represented by a soft, refreshing green to symbolize growth, while student "needs" or "asks" are highlighted in a warm orange to draw attention and prompt helpful responses.

## Typography

This design system uses **Be Vietnam Pro** as a single, unified typeface across all levels of the interface. This creates a cohesive, modern aesthetic that feels both professional and contemporary. 

Headlines utilize the heavier weights of Be Vietnam Pro to create a strong visual hierarchy, while body copy and labels benefit from its high legibility and geometric clarity. We use a strict 1.6x line-height for body text to maintain the "clean" and "airy" feel requested in the brand brief, ensuring long-form student bios and networking posts remain legible across all device sizes.

## Layout & Spacing

The layout adheres to a **Fixed Grid** model for desktop, centered within the viewport to maintain focus. We utilize a 12-column system with generous 24px gutters to ensure that even dense information displays feel organized.

The spacing rhythm is built on a 4px/8px baseline. Horizontal margins are kept wide (32px+ on desktop) to reinforce the sense of "plenty of whitespace." Vertical rhythm should follow the "stack" variables—using 16px between related elements and 32px between distinct sections to create clear visual grouping without the need for heavy dividers.

## Elevation & Depth

To maintain the "clean" and "modern" feel, this design system avoids heavy, dark shadows. Instead, it uses **Ambient Shadows** with a subtle color tint derived from the primary Indigo. 

Depth is communicated through three tiers:
1. **Flat (Level 0):** Used for the main background.
2. **Raised (Level 1):** Used for cards and navigation bars. These feature a 1px soft border (#E2E8F0) and a very diffused 4px blur shadow with 2% opacity.
3. **Floating (Level 2):** Used for modals and dropdowns. These use a more pronounced 12px blur with 5% opacity to suggest they are sitting significantly above the content.

## Shapes

The shape language is defined by **Soft Roundedness**. A standard radius of 8px (0.5rem) is applied to buttons, input fields, and small cards. For larger containers like profile headers or main content areas, the radius increases to 16px (1rem) to emphasize a "friendly" and "approachable" container style. 

Interactive elements should never have sharp corners, as rounding reinforces the "safe and collaborative" brand personality.

## Components

- **Buttons:** Primary buttons use a solid Indigo fill with white text. Secondary buttons use a Teal outline with a transparent background. All buttons have a height of 44px for high touch-targets.
- **Chips (Tags):** Skills use a soft green background (10% opacity) with dark green text. "Needs" use a soft orange background (10% opacity) with dark orange text. All chips are pill-shaped (full radius).
- **Cards:** Profile and networking cards feature a white background, Level 1 elevation, and 12px internal padding.
- **Inputs:** Text fields use a light gray background (#F1F5F9) that transitions to white with a 2px Indigo border on focus.
- **Icons:** Use a consistent 24px grid. Line weights should be "Medium" (2px) with rounded caps and joins to match the overall shape language.
- **Identity Badges:** Small 4px circular indicators or subtle glows are used to show "online" or "active collaborator" status, reinforcing the energetic nature of the platform.