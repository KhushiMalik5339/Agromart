---
name: AgroMart
colors:
  surface: '#f7fbf0'
  surface-dim: '#d7dbd2'
  surface-bright: '#f7fbf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5eb'
  surface-container: '#ebefe5'
  surface-container-high: '#e5eadf'
  surface-container-highest: '#e0e4da'
  on-surface: '#181d17'
  on-surface-variant: '#40493d'
  inverse-surface: '#2d322b'
  inverse-on-surface: '#eef2e8'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#286b33'
  on-secondary: '#ffffff'
  secondary-container: '#abf4ac'
  on-secondary-container: '#2e7238'
  tertiary: '#923357'
  on-tertiary: '#ffffff'
  tertiary-container: '#b14b6f'
  on-tertiary-container: '#ffedf0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#abf4ac'
  secondary-fixed-dim: '#90d792'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#07521d'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c7'
  on-tertiary-fixed: '#3f001c'
  on-tertiary-fixed-variant: '#7f2448'
  background: '#f7fbf0'
  on-background: '#181d17'
  surface-variant: '#e0e4da'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style
The design system is built on a foundation of **Organic Modernism**. It bridges the gap between the raw, tactile nature of agriculture and the high-end precision of a luxury digital marketplace. The aesthetic is deeply rooted in transparency, freshness, and the "farm-to-home" narrative.

The visual style leverages **Minimalism** with a **Tactile** edge. It features generous whitespace to allow product photography to breathe, high-contrast typography for legibility, and soft, natural layering to create a sense of approachability and trust. The goal is an interface that feels as clean and organized as a premium boutique grocery store.

## Colors
This design system utilizes a palette inspired by natural landscapes. 

- **Primary (Forest Green):** Reserved for core brand moments, primary navigation states, and the final "Place Order" actions.
- **Secondary (Light Green):** Used for soft backgrounds, category tags, and success states. It provides a lush, fresh feeling without the weight of the primary green.
- **Accent (Amber):** Strategically applied to high-conversion CTAs (Add to Cart), star ratings, and promotional badges to provide a warm, sun-kissed contrast.
- **Background & Surface:** The background uses a subtle organic tint to reduce eye strain and feel more "earthy" than a clinical pure white, while surfaces remain pure white to define clear elevation.

## Typography
The typography strategy pairings high-character headlines with a functional, systematic body face.

- **Headlines (Poppins):** Selected for its geometric clarity and friendly curves. Use "Bold" for main page headers and "SemiBold" for section titles.
- **Body & UI (Inter):** A workhorse typeface that ensures maximum readability for product descriptions, nutritional facts, and complex checkout flows. 
- **Hierarchy:** Maintain a tight vertical rhythm. Use `display-lg` exclusively for marketing hero sections. Use `label-lg` for button text and navigation links to ensure structural clarity.

## Layout & Spacing
The layout follows a strict **8px grid system** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid is used for desktop (max-width 1440px), transitioning to a 4-column grid for mobile.
- **Margins:** Desktop margins are set to `xxl` (48px) to reinforce the premium, spacious feel. Mobile margins are set to `lg` (24px) to provide a comfortable touch-safe area.
- **Rhythm:** Use `md` (16px) for internal card padding and `xl` (32px) for vertical spacing between distinct content sections.

## Elevation & Depth
This design system uses **Ambient Shadows** to create a soft, natural sense of depth. Shadows should never feel "heavy" or "dirty."

- **Level 1 (Base):** Subtle 1px border in a darker tint of the background color for flat elements like input fields.
- **Level 2 (Cards):** A soft, diffused shadow (Y: 4, Blur: 20, Opacity: 0.04) with a slight green-tinted shadow color (#2E7D32 at 4% opacity).
- **Level 3 (Interactive/Floating):** Used for active cart drawers or floating action buttons. A more pronounced shadow (Y: 8, Blur: 32, Opacity: 0.08) to indicate immediate proximity to the user.
- **Backdrop:** Use a soft background blur (12px) behind modal overlays to maintain the "fresh" and "airy" atmosphere.

## Shapes
Shapes are defined by generous, friendly radii that evoke an organic feel rather than a mechanical one.

- **Small (8px):** Applied to buttons, input fields, and small tags.
- **Medium (16px):** The standard for product cards, category tiles, and dropdown menus.
- **Large (24px):** Used for large feature containers, hero banners, and bottom sheets on mobile.
- **Icons:** Use modern, 2pt weight outline icons with rounded caps and joins to match the typography.

## Components
- **Buttons:** Primary buttons use the Primary Green with white text. Secondary buttons use a Light Green tint background with Primary Green text. The "Add to Cart" CTA should utilize the Amber accent to stand out.
- **Product Cards:** Must feature a white surface with Medium (16px) roundedness and Level 2 elevation. Images should have a subtle 0.5px inner stroke to define boundaries against white backgrounds.
- **Inputs:** Use a soft background (#F1F5EB) instead of a white background to differentiate from the card surface. On focus, the border transitions to Primary Green.
- **Chips/Tags:** Use Secondary Green for "Organic" or "Fresh" labels with 12px padding and 100px (pill) roundedness.
- **Quantity Pickers:** A unified component with a soft grey background and Primary Green icons for (+) and (-), emphasizing the tactile nature of the "AgroMart" shopping experience.