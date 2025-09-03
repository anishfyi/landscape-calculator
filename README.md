# Landscape Cost Calculator

A modern React + TypeScript app to estimate landscaping project costs and explore flexible payment plans. Users can select features (tiles, pool, pergola, lighting, etc.), choose a quality/budget tier, and instantly view total costs and 3/6/12‑month payment plans. Results can be viewed in AED or USD.

## Features

- **Interactive calculator**: Pick area size and toggle features to estimate the base project cost.
- **Budget tiers**: Economic, Standard, High‑end, Super high‑end multipliers.
- **Payment plans**: Auto‑computed 3, 6, and 12‑month plans with downpayment, move‑in, and monthly installments.
- **Currency toggle**: View results in **AED** or **USD** with a configurable exchange rate.
- **Modern UI**: Built with Tailwind CSS and shadcn/ui (Radix primitives) for accessible components.

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **React Hook Form** + **Zod** (form + validation)
- **React Router** for page routing

## Getting Started

Prerequisites:
- Node.js 18+ recommended

Install dependencies:
```bash
npm install
```

Run the dev server:
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
