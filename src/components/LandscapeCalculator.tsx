import { useState } from "react";
import { CalculatorForm } from "./CalculatorForm";
import { PlanCard } from "./PlanCard";
import { CurrencyToggle } from "./CurrencyToggle";
import { 
  CalculationInputs, 
  calculateBaseCost, 
  calculatePaymentPlans, 
  convertCurrency,
  CalculationResult 
} from "@/utils/calculations";
import calculatorHero from "@/assets/calculator-hero.jpg";

export const LandscapeCalculator = () => {
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (inputs: CalculationInputs) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseCost = calculateBaseCost(inputs);
    const plans = calculatePaymentPlans(baseCost);
    
    setResults({ baseCost, plans });
    setIsCalculating(false);
  };

  const convertAmount = (amount: number) => {
    return currency === 'USD' ? convertCurrency(amount, true) : amount;
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={calculatorHero} 
          alt="Landscape Calculator"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Landscape Cost Calculator
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto px-4">
              Plan your dream outdoor space with accurate cost estimates and flexible payment options
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Calculator Form */}
          <div className="lg:w-2/5">
            <CalculatorForm 
              onCalculate={handleCalculate} 
              isCalculating={isCalculating}
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:w-3/5">
            <div className="space-y-6">
              {/* Currency Toggle */}
              <div className="flex justify-end">
                <CurrencyToggle 
                  currency={currency} 
                  onToggle={setCurrency} 
                />
              </div>

              {/* Results */}
              {results ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Payment Plans Available
                    </h3>
                    <p className="text-muted-foreground">
                      Choose the payment plan that works best for you
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
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
      </div>
    </div>
  );
};