import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CurrencyToggleProps {
  currency: 'AED' | 'USD';
  onToggle: (currency: 'AED' | 'USD') => void;
}

export const CurrencyToggle = ({ currency, onToggle }: CurrencyToggleProps) => {
  return (
    <div className="flex items-center gap-3 bg-gradient-card p-4 rounded-lg shadow-soft">
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
  );
};