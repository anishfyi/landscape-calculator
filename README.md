# Landscape Cost Calculator

A modern React and TypeScript application to estimate landscaping project costs and explore flexible payment plans. Users can select features (tiles, pool, pergola, lighting, and more), choose a budget tier, and instantly view total costs and 3, 6, and 12‑month payment plans. Results can be viewed in United Arab Emirates Dirham or United States Dollar.

## Features

- **Interactive calculator**: Pick area size and toggle features to estimate the base project cost.
- **Budget tiers**: Economic, Standard, High‑end, Super high‑end multipliers.
- **Payment plans**: Auto‑computed 3, 6, and 12‑month plans with downpayment, move‑in, and monthly installments.
- **Currency toggle**: View results in **AED** or **USD** with a configurable exchange rate.
- **Modern UI**: Built with Tailwind CSS and shadcn/ui (Radix primitives) for accessible components.

## Tech Stack

- **Vite** with **React 18** and **TypeScript**
- **Tailwind CSS** and **shadcn/ui** (Radix UI primitives)
- **React Hook Form** and **Zod** (forms and validation)
- **React Router** for page routing

## Getting Started

Prerequisites:
- Node.js 18 or newer

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Lint the codebase:
```bash
npm run lint
```

## Available Scripts

- `dev`: Start Vite dev server
- `build`: Production build
- `build:dev`: Development‑mode build (useful for inspecting unminified output)
- `preview`: Preview the built app locally
- `lint`: Run ESLint

## Design System and Tokens

The theme uses a light‑only palette with strong typography, an eight‑pixel spacing scale, and smooth micro‑interactions.

- **Typography**: System font stack (configurable via Tailwind `fontFamily.sans`). Suggested sizes: heading 1: 32–36 pixels, heading 2: 24–28 pixels, body: 16 pixels, small: 13–14 pixels; line height: 1.4–1.6.
- **Color**: Pure white backgrounds with slate neutrals and a single accent color. Change the accent by updating `--primary` and `--accent` in `src/index.css`.
- **Spacing**: Eight‑pixel step scale via utility classes.
- **Radius**: Set by `--radius` in `src/index.css` and mapped to Tailwind via `theme.extend.borderRadius` in `tailwind.config.ts`.
- **Shadows and transitions**: `--shadow-*` and `--transition-*` tokens in `src/index.css`.

Key tokens are defined in `src/index.css` under `@layer base :root`, and are surfaced into Tailwind via `tailwind.config.ts` so components can use semantic classes like `bg-background`, `text-foreground`, `ring`, `shadow-soft`, and gradient utilities.

## Accessibility

- All inputs have associated `label` elements and clear helper text.
- Keyboard operability is supported via native semantics and shadcn/ui primitives.
- Color contrast is tuned for WCAG AA in light mode.
- Result sections are intended to be announced; future improvements will include an `aria-live` region.

## Testing

Unit tests will be added for core pricing logic and edge cases (zero or negative inputs, very large values, invalid formats). Visual tests or Storybook snapshot tests will be introduced to prevent regressions in critical components like `PlanCard`.

## Contributing

1. Create a feature branch.
2. Commit changes in small, atomic commits with clear messages.
3. Run format and lint checks: `npm run lint`.
4. Build: `npm run build`.
5. Open a pull request with a clear description and checklist.

## Roadmap

- Polish visual hierarchy and spacing for a premium feel.
- Add animated number transitions and micro‑interactions.
- Add export options (copy result, download comma separated values, share link).
- Add persistence via query parameters and local storage (opt‑in).
- Improve accessibility with `aria-live` on results and enhanced focus states.

## Project Structure

```text
src/
  components/
    CalculatorForm.tsx
    CurrencyToggle.tsx
    LandscapeCalculator.tsx
    PlanCard.tsx
    ui/               # shadcn/ui components
  hooks/
  lib/
  pages/
    Index.tsx
    NotFound.tsx
  utils/
    calculations.ts   # Core pricing + plan logic
  assets/
```

The main calculator view lives in `src/components/LandscapeCalculator.tsx`. Core math is defined in `src/utils/calculations.ts`.

## How the Calculations Work

Defined in `src/utils/calculations.ts`:

- **Feature base costs (AED)**: `FEATURE_COSTS` includes per‑m² and per‑unit pricing. Pools are treated as a fixed base cost.
- **Budget multipliers**: `BUDGET_MULTIPLIERS` scales the computed base cost by the selected quality tier.
- **Base cost**: Sum selected feature costs (area‑based or per‑unit), then apply the budget multiplier.
- **Payment plans**: `PAYMENT_PLANS` defines markup, downpayment %, move‑in %, and months for `3months`, `6months`, and `12months`.
  - `totalCost = baseCost * (1 + markup)`
  - `downpayment = totalCost * downpayment%`
  - `moveIn = totalCost * moveIn%`
  - `monthlyInstallment = (totalCost - downpayment - moveIn) / months`
- **Currency conversion**: `AED_TO_USD_RATE` (default ~0.27). Toggling to USD multiplies by this rate; toggling back divides.

## Customization

Adjust these in `src/utils/calculations.ts`:

- **Feature pricing**: Update `FEATURE_COSTS`
- **Budget tiers**: Update `BUDGET_MULTIPLIERS`
- **Plan terms**: Update `PAYMENT_PLANS` (markup, downpayment, move‑in, months)
- **FX rate**: Update `AED_TO_USD_RATE`

## Notes

- All prices are estimates; final costs can vary by site conditions and specific requirements.
- Move‑in payment is due upon project completion.
- Exchange rates can fluctuate; update the constant to reflect current rates.

## Acknowledgements

- UI components are based on **shadcn/ui** (Radix UI primitives) and Tailwind CSS.
