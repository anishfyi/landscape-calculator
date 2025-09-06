import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Home, Info, Ruler, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalculationInputs } from "@/utils/calculations";

interface CalculatorFormProps {
  onCalculate: (inputs: CalculationInputs) => void;
  isCalculating: boolean;
}

export const CalculatorForm = ({ onCalculate, isCalculating }: CalculatorFormProps) => {
  const [size, setSize] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [features, setFeatures] = useState({
    tiles: false,
    pool: false,
    seating: false,
    bar: false,
    pizzaOven: false,
    grill: false,
    fridge: false,
    pergola: false,
    trees: false,
    lighting: false,
    artificialGrass: false,
  });
  const [remember, setRemember] = useState<boolean>(false);

  // Persist last values (opt‑in key)
  const storageKey = 'landscape_calc_last_inputs_v1';
  const storageEnabledKey = 'landscape_calc_persist_enabled_v1';
  useEffect(() => {
    const enabled = localStorage.getItem(storageEnabledKey) === 'true';
    setRemember(enabled);
    if (enabled) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { size: string; budget: string; features: typeof features };
          if (parsed && typeof parsed === 'object') {
            setSize(parsed.size ?? "");
            setBudget(parsed.budget ?? "");
            setFeatures(prev => ({ ...prev, ...(parsed.features ?? {}) }));
          }
        } catch {
          // ignore JSON parse errors
        }
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageEnabledKey, remember ? 'true' : 'false');
      if (!remember) {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore storage errors
    }
  }, [remember]);

  const handleFeatureChange = (feature: keyof typeof features, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: checked }));
  };

  const handleCalculate = () => {
    const sizeNumber = parseFloat(size);
    if (!size || !budget || !(sizeNumber > 0)) return;
    
    onCalculate({
      size: sizeNumber,
      features,
      budget: budget as "economic" | "standard" | "highEnd" | "superHighEnd"
    });

    // Save last values for convenience
    if (remember) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ size, budget, features }));
      } catch {
        // ignore storage errors
      }
    }
  };

  const featureLabels = {
    tiles: "Tiles",
    pool: "Pool (6 units)",
    seating: "Built-in Seating",
    bar: "Bar",
    pizzaOven: "Pizza Oven",
    grill: "Built-in Grill",
    fridge: "Outdoor Fridge",
    pergola: "Pergola",
    trees: "Trees",
    lighting: "Lighting",
    artificialGrass: "Artificial Grass",
  };

  return (
    <div className="bg-gradient-card p-6 rounded-xl shadow-medium border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Landscape Calculator</h2>
      </div>

      <div className="space-y-6">
        {/* Size Input */}
        <div className="space-y-2">
          <Label htmlFor="size" className="text-sm font-medium text-foreground">
            Landscape Size (m²)
          </Label>
          <Input
            id="size"
            type="number"
            placeholder="Enter size in square meters"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min={0}
            step="any"
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                e.preventDefault();
              }
            }}
            onBlur={(e) => {
              const n = parseFloat(e.target.value);
              if (!Number.isNaN(n) && n < 0) {
                setSize("0");
              }
            }}
            className="bg-input border-border focus:ring-primary"
            aria-describedby="size-help size-error"
          />
          <div id="size-help" className="flex items-start gap-2 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5 mt-0.5" />
            <p>Tip: Measure the planned landscaped area only. Exclude driveways and built structures.</p>
          </div>
          {size !== "" && parseFloat(size) <= 0 && (
            <div id="size-error" className="text-xs text-destructive">Please enter a size greater than zero.</div>
          )}
        </div>

        {/* Budget Selection */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium text-foreground">
            Budget Category
          </Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="bg-input border-border focus:ring-primary">
              <SelectValue placeholder="Select budget category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="economic">Economic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="highEnd">High End</SelectItem>
              <SelectItem value="superHighEnd">Super High End</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>Higher tiers include premium materials, finishes, and craftsmanship multipliers.</span>
          </div>
        </div>

        {/* Features Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Landscape Features
          </Label>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-1">
            {Object.entries(featureLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={features[key as keyof typeof features]}
                  onCheckedChange={(checked) => 
                    handleFeatureChange(key as keyof typeof features, !!checked)
                  }
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={key}
                  className="text-sm text-foreground cursor-pointer flex-1"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={!size || !budget || isCalculating}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-medium"
          size="lg"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isCalculating ? "Calculating..." : "Calculate Costs"}
        </Button>

        {/* Remember Inputs */}
        <div className="flex items-center space-x-3 pt-1">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(c) => setRemember(!!c)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
            Remember inputs on this device
          </Label>
        </div>
      </div>
    </div>
  );
};