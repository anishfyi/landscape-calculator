import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CurrencyToggleProps {
  currency: 'AED' | 'USD';
  onToggle: (currency: 'AED' | 'USD') => void;
}

export const CurrencyToggle = ({ currency, onToggle }: CurrencyToggleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 bg-gradient-card p-4 rounded-lg shadow-soft cursor-default select-none">
            <Label htmlFor="currency-toggle" className="text-sm font-medium text-foreground">
              AED
            </Label>
            <Switch
              id="currency-toggle"
              checked={currency === 'USD'}
              onCheckedChange={(checked) => onToggle(checked ? 'USD' : 'AED')}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="currency-toggle" className="text-sm font-medium text-foreground">
              USD
            </Label>
            <div className="ml-2 text-xs text-muted-foreground">
              1 AED ≈ 0.27 USD
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Toggle to view all values in your preferred currency.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};