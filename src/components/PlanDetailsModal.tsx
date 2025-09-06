import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface PlanDetailsModalProps {
  planKey: string;
  plan: {
    totalCost: number;
    downpayment: number;
    moveIn: number;
    monthlyInstallment: number;
    months: number;
  };
  currency: 'AED' | 'USD';
  onClose: () => void;
}

const PlanDetailsModal = ({ planKey, plan, currency, onClose }: PlanDetailsModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevActive?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={dialogRef} className="relative z-10 w-full max-w-lg rounded-xl bg-background border border-border shadow-strong">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="plan-dialog-title" className="text-lg font-semibold">{planKey.replace('months', ' Months')} Details</h2>
          <button ref={closeBtnRef} onClick={onClose} className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Close details">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span>Total Cost</span>
            <strong>{formatCurrency(plan.totalCost, currency)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Down Payment</span>
            <strong>{formatCurrency(plan.downpayment, currency)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Move-In</span>
            <strong>{formatCurrency(plan.moveIn, currency)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Monthly</span>
            <strong>{formatCurrency(plan.monthlyInstallment, currency)} × {plan.months}</strong>
          </div>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;


