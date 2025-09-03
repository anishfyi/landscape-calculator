import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/calculations";
import { Calendar, CreditCard, Home, TrendingUp } from "lucide-react";

interface PlanCardProps {
  title: string;
  totalCost: number;
  downpayment: number;
  moveIn: number;
  monthlyInstallment: number;
  months: number;
  currency: 'AED' | 'USD';
  isPopular?: boolean;
}

export const PlanCard = ({
  title,
  totalCost,
  downpayment,
  moveIn,
  monthlyInstallment,
  months,
  currency,
  isPopular = false
}: PlanCardProps) => {
  const formatTitle = (title: string) => {
    return title.replace('months', ' Months');
  };

  const getIcon = () => {
    if (months === 3) return <TrendingUp className="h-4 w-4 text-primary-foreground" />;
    if (months === 6) return <Calendar className="h-4 w-4 text-primary-foreground" />;
    return <Home className="h-4 w-4 text-primary-foreground" />;
  };

  return (
    <Card className={`bg-gradient-card shadow-medium border-border transition-all duration-300 hover:shadow-strong hover:scale-[1.02] ${
      isPopular ? 'ring-2 ring-primary ring-opacity-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-primary rounded-md">
              {getIcon()}
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              {formatTitle(title)}
            </CardTitle>
          </div>
          {isPopular && (
            <Badge className="bg-accent text-accent-foreground text-xs px-2 py-1">
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Total Cost */}
        <div className="text-center p-4 bg-muted rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(totalCost, currency)}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Down Payment</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrency(downpayment, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Move-In Payment</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrency(moveIn, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">EMI</span>
            </div>
            <span className="font-bold text-success">
              {formatCurrency(monthlyInstallment, currency)}
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          {months} monthly payments of {formatCurrency(monthlyInstallment, currency)}
        </div>
      </CardContent>
    </Card>
  );
};