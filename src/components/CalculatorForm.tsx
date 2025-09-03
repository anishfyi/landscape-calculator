import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Home } from "lucide-react";
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

  const handleFeatureChange = (feature: keyof typeof features, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: checked }));
  };

  const handleCalculate = () => {
    if (!size || !budget) return;
    
    onCalculate({
      size: parseFloat(size),
      features,
      budget: budget as "economic" | "standard" | "highEnd" | "superHighEnd"
    });
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
            className="bg-input border-border focus:ring-primary"
          />
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
        </div>

        {/* Features Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Landscape Features
          </Label>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
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
      </div>
    </div>
  );
};