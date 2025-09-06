import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, toFixedDisplay } from "@/utils/calculations";
import { Calendar, CreditCard, Home, TrendingUp, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "./AnimatedNumber";

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
      isPopular ? 'ring-2 ring-primary/60' : ''
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
            <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-1 uppercase tracking-wider">
              Best Value
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Total Cost */}
        <div className="text-center p-4 bg-muted rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
          <div className="text-2xl font-extrabold text-primary" title={`Raw: ${toFixedDisplay(totalCost)}`}>
            <AnimatedNumber value={totalCost} format={(n) => formatCurrency(n, currency)} ariaLabel="Total cost" />
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Down Payment</span>
            </div>
            <span
              className="font-semibold text-foreground"
              title={`Raw: ${toFixedDisplay(downpayment)}`}
            >
              <AnimatedNumber value={downpayment} format={(n) => formatCurrency(n, currency)} ariaLabel="Down payment" />
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Move-In Payment</span>
            </div>
            <span
              className="font-semibold text-foreground"
              title={`Raw: ${toFixedDisplay(moveIn)}`}
            >
              <AnimatedNumber value={moveIn} format={(n) => formatCurrency(n, currency)} ariaLabel="Move in payment" />
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">EMI</span>
            </div>
            <span
              className="font-bold text-success"
              title={`Raw: ${toFixedDisplay(monthlyInstallment)}`}
            >
              <AnimatedNumber value={monthlyInstallment} format={(n) => formatCurrency(n, currency)} ariaLabel="Monthly installment" />
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          {months} monthly payments of {formatCurrency(monthlyInstallment, currency)}
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="secondary" size="sm" aria-label="Copy result to clipboard">
            <Copy className="h-3.5 w-3.5 mr-1" /> Copy
          </Button>
          <Button variant="secondary" size="sm" aria-label="Download results as comma separated values">
            <Download className="h-3.5 w-3.5 mr-1" /> CSV
          </Button>
          <Button variant="secondary" size="sm" aria-label="Share results link">
            <Share2 className="h-3.5 w-3.5 mr-1" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};