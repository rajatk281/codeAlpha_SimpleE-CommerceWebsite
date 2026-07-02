import { Check, Circle } from 'lucide-react';

const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const OrderTimeline = ({ currentStatus }) => {
  const currentIndex = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-lg">×</span>
          </div>
          <span className="text-sm font-medium text-red-400">Order Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= currentIndex ? 'gradient-accent text-white' : 'bg-surface text-text-secondary'}`}>
                {i < currentIndex ? <Check className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
              </div>
              <span className={`text-[10px] mt-2 ${i <= currentIndex ? 'text-accent font-medium' : 'text-text-secondary'}`}>{step.charAt(0) + step.slice(1).toLowerCase()}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 mx-1 ${i < currentIndex ? 'bg-accent' : 'bg-surface'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
