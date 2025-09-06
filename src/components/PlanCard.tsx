import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, toFixedDisplay, buildShareUrl } from "@/utils/calculations";
import { Calendar, CreditCard, Home, TrendingUp, Copy, Download, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "./AnimatedNumber";
import { useMemo, useRef, useState } from "react";

interface PlanCardProps {
  title: string;
  totalCost: number;
  downpayment: number;
  moveIn: number;
  monthlyInstallment: number;
  months: number;
  currency: 'AED' | 'USD';
  isPopular?: boolean;
  onFocus?: () => void;
}

export const PlanCard = ({
  title,
  totalCost,
  downpayment,
  moveIn,
  monthlyInstallment,
  months,
  currency,
  isPopular = false,
  onFocus
}: PlanCardProps) => {
  const formatTitle = (title: string) => {
    return title.replace('months', ' Months');
  };

  const getIcon = () => {
    if (months === 3) return <TrendingUp className="h-4 w-4 text-primary-foreground" />;
    if (months === 6) return <Calendar className="h-4 w-4 text-primary-foreground" />;
    return <Home className="h-4 w-4 text-primary-foreground" />;
  };

  const amountDuration = useMemo(() => {
    const magnitude = Math.abs(totalCost);
    if (magnitude < 10000) return 150;
    if (magnitude < 100000) return 250;
    if (magnitude < 1000000) return 400;
    return 600;
  }, [totalCost]);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleCopy = async () => {
    try {
      const text = `Plan: ${formatTitle(title)}\nTotal: ${formatCurrency(totalCost, currency)}\nDown: ${formatCurrency(downpayment, currency)}\nMove-In: ${formatCurrency(moveIn, currency)}\nEMI: ${formatCurrency(monthlyInstallment, currency)} x ${months}`;
      await navigator.clipboard.writeText(text);
    } catch {}
  };
  const handleCsv = async () => {
    const rows = [
      ['plan', 'total', 'downpayment', 'moveIn', 'monthly', 'months'],
      [formatTitle(title), String(totalCost), String(downpayment), String(moveIn), String(monthlyInstallment), String(months)]
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    try {
      await navigator.clipboard.writeText(csv);
    } catch {}
  };
  const handleShare = async () => {
    try {
      const url = buildShareUrl();
      if (url) {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
  };

  return (
    <Card
      className={`bg-gradient-card shadow-medium border-border transition-all duration-300 hover:shadow-strong hover:scale-[1.02] min-w-0 ${
      isPopular ? 'ring-2 ring-primary/60' : ''
    }`}
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFocus?.(); } }}
      aria-label={`Open ${formatTitle(title)} details`}
    >
      <CardHeader className="pb-3 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-gradient-primary rounded-md">
              {getIcon()}
            </div>
            <CardTitle className="text-lg font-bold text-foreground truncate">
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
      
      <CardContent className="space-y-4 min-w-0">
        {/* Total Cost */}
        <div className="text-center p-4 bg-muted rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
          <div className="amount font-semibold leading-tight break-anywhere" style={{ fontSize: "clamp(1.25rem, 4vw, 2.8rem)" }} title={`Raw: ${toFixedDisplay(totalCost)}`}>
            <AnimatedNumber value={totalCost} format={(n) => formatCurrency(n, currency)} ariaLabel="Total cost" durationMs={amountDuration} />
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground break-words">Down Payment</span>
            </div>
            <span
              className="font-semibold text-foreground"
              title={`Raw: ${toFixedDisplay(downpayment)}`}
            >
              <AnimatedNumber value={downpayment} format={(n) => formatCurrency(n, currency)} ariaLabel="Down payment" />
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground break-words">Move-In Payment</span>
            </div>
            <span
              className="font-semibold text-foreground"
              title={`Raw: ${toFixedDisplay(moveIn)}`}
            >
              <AnimatedNumber value={moveIn} format={(n) => formatCurrency(n, currency)} ariaLabel="Move in payment" />
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">EMI</span>
            </div>
            <span
              className="font-bold text-success leading-tight break-words"
              title={`Raw: ${toFixedDisplay(monthlyInstallment)}`}
            >
              <AnimatedNumber value={monthlyInstallment} format={(n) => formatCurrency(n, currency)} ariaLabel="Monthly installment" />
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          {months} monthly payments of {formatCurrency(monthlyInstallment, currency)}
        </div>

        <div className="actions flex items-center gap-3 justify-end flex-wrap w-full">
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleCopy(); }} className="inline-flex items-center gap-2 px-3 py-2 min-w-[88px] whitespace-nowrap" aria-label="Copy results to clipboard">
              <Copy className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleCsv(); }} className="inline-flex items-center gap-2 px-3 py-2 min-w-[88px] whitespace-nowrap" aria-label="Copy comma separated values to clipboard">
              <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleShare(); }} className="inline-flex items-center gap-2 px-3 py-2 min-w-[88px] whitespace-nowrap" aria-label="Share results link">
              <Share2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
          <div className="relative sm:hidden">
            <Button ref={menuBtnRef} variant="secondary" size="sm" aria-haspopup="menu" aria-expanded={menuOpen} aria-label="More actions" onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-md">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
            {menuOpen && (
              <div role="menu" aria-label="Plan actions" className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-background shadow-medium z-10" onClick={(e) => e.stopPropagation()}>
                <button role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={() => { setMenuOpen(false); handleCopy(); }}>Copy</button>
                <button role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={() => { setMenuOpen(false); handleCsv(); }}>Copy CSV</button>
                <button role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={() => { setMenuOpen(false); handleShare(); }}>Copy Link</button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};