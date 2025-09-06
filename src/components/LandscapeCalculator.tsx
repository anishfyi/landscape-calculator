import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { ShieldCheck, Sparkles, Leaf, ArrowLeft } from "lucide-react";
import { CalculatorForm } from "./CalculatorForm";
import { PlanCard } from "./PlanCard";
import { CurrencyToggle } from "./CurrencyToggle";
import { 
  CalculationInputs, 
  calculateBaseCost, 
  calculatePaymentPlans, 
  convertCurrency,
  CalculationResult,
  buildShareUrl
} from "@/utils/calculations";
import calculatorHero from "@/assets/calculator-hero.jpg";

export const LandscapeCalculator = () => {
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCalculator, setShowCalculator] = useState(true);
  const [lastInputs, setLastInputs] = useState<CalculationInputs | null>(null);
  const [focusedPlanKey, setFocusedPlanKey] = useState<string | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const Modal = lazy(() => import("./PlanDetailsModal"));

  const handleCalculate = async (inputs: CalculationInputs) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseCost = calculateBaseCost(inputs);
    const plans = calculatePaymentPlans(baseCost);
    
    const next = { baseCost, plans } as CalculationResult;
    setResults(next);
    setIsCalculating(false);
    setShowCalculator(false);
    setLastInputs(inputs);

    try {
      localStorage.setItem('landscape_calculator_inputs', JSON.stringify(inputs));
    } catch {}

    // Optionally encode query params for sharing current state
    try {
      const url = buildShareUrl(inputs);
      if (url) {
        window.history.replaceState({}, "", url);
      }
    } catch {}
  };

  const convertAmount = (amount: number) => {
    return currency === 'USD' ? convertCurrency(amount, true) : amount;
  };

  useEffect(() => {
    if (!results || !liveRegionRef.current) return;
    liveRegionRef.current.textContent = `Payment plans ready.`;
  }, [results, currency]);

  // Prefill from query params or localStorage if available
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.size || params.budget) {
        const features: CalculationInputs['features'] = {
          tiles: params.get('tiles') === '1',
          pool: params.get('pool') === '1',
          seating: params.get('seating') === '1',
          bar: params.get('bar') === '1',
          pizzaOven: params.get('pizzaOven') === '1',
          grill: params.get('grill') === '1',
          fridge: params.get('fridge') === '1',
          pergola: params.get('pergola') === '1',
          trees: params.get('trees') === '1',
          lighting: params.get('lighting') === '1',
          artificialGrass: params.get('artificialGrass') === '1',
        };
        const size = parseFloat(params.get('size') || '0');
        const budget = (params.get('budget') || 'standard') as CalculationInputs['budget'];
        const initial: CalculationInputs = { size, features, budget };
        setLastInputs(initial);
        return;
      }
    } catch {}
    try {
      const stored = localStorage.getItem('landscape_calculator_inputs');
      if (stored) {
        const parsed = JSON.parse(stored) as CalculationInputs;
        setLastInputs(parsed);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={calculatorHero} 
          alt="Landscape Calculator"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary-glow/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
              Landscape Cost Calculator
            </h1>
            <p className="text-base md:text-xl opacity-95 max-w-2xl mx-auto">
              Plan your dream outdoor space with precise estimates and flexible financing
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-background/20 backdrop-blur px-3 py-1.5 text-sm shadow-soft">
                <ShieldCheck className="h-4 w-4" />
                <span>Trusted estimates</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background/20 backdrop-blur px-3 py-1.5 text-sm shadow-soft">
                <Sparkles className="h-4 w-4" />
                <span>Premium materials</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background/20 backdrop-blur px-3 py-1.5 text-sm shadow-soft">
                <Leaf className="h-4 w-4" />
                <span>Sustainable options</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!showCalculator && (
          <div className="sticky top-0 z-20 mb-4 flex justify-start">
            <button
              onClick={() => setShowCalculator(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-background border border-border shadow-sm text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Back to Calculator"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Calculator</span>
            </button>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Calculator Form */}
          <div
            className={`min-w-0 transition-all duration-300 ${
              showCalculator ? 'lg:w-2/5 opacity-100' : 'lg:w-0 opacity-0 pointer-events-none'
            }`}
            aria-hidden={!showCalculator}
          >
            <CalculatorForm
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              initialInputs={lastInputs || undefined}
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:w-3/5 min-w-0">
            <div className="space-y-6">
              {/* Currency Toggle */}
              <div className="flex justify-end">
                <CurrencyToggle 
                  currency={currency} 
                  onToggle={setCurrency} 
                />
              </div>

              {/* Results */}
              {isCalculating && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-6 rounded-xl bg-gradient-card border border-border shadow-medium animate-pulse h-56" />
                  ))}
                </div>
              )}
              {results ? (
                <div className="space-y-6">
                  <div
                    ref={liveRegionRef}
                    role="status"
                    aria-live="polite"
                    className="sr-only"
                  />
                  <div className="text-center min-w-0">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Payment Plans Available
                    </h3>
                    <p className="text-muted-foreground">
                      Choose the payment plan that works best for you
                    </p>
                  </div>

                  <div className="min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                    {Object.entries(results.plans).map(([planKey, plan], index) => (
                      <PlanCard
                        key={planKey}
                        title={planKey}
                        totalCost={convertAmount(plan.totalCost)}
                        downpayment={convertAmount(plan.downpayment)}
                        moveIn={convertAmount(plan.moveIn)}
                        monthlyInstallment={convertAmount(plan.monthlyInstallment)}
                        months={plan.months}
                        currency={currency}
                        isPopular={index === 1} // Mark 6-month plan as popular
                        onFocus={() => setFocusedPlanKey(planKey)}
                      />
                    ))}
                  </div>

                  <div className="bg-gradient-card p-6 rounded-xl shadow-medium border border-border">
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      Important Notes
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• All prices include materials and installation</li>
                      <li>• Final costs may vary based on site conditions and specific requirements</li>
                      <li>• Move-in payment is due upon project completion</li>
                      <li>• Exchange rate: 1 AED ≈ 0.27 USD (rates may fluctuate)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-card rounded-xl shadow-medium border border-border">
                  <div className="text-muted-foreground text-lg mb-4">
                    Configure your landscape preferences and get instant cost estimates
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Fill out the form on the left to see your payment options
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Modal */}
        {focusedPlanKey && results && (
          <Suspense fallback={null}>
            <Modal
              planKey={focusedPlanKey}
              plan={results.plans[focusedPlanKey]}
              currency={currency}
              onClose={() => setFocusedPlanKey(null)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};