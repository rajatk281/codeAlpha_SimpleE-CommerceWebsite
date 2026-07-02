import { useState } from 'react';
import { Tag } from 'lucide-react';

const CouponInput = ({ onApply }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium">Have a coupon?</span>
      </div>
      <div className="flex gap-2">
        <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" className="input-field text-sm flex-1 py-2.5" />
        <button onClick={handleApply} className="btn-secondary text-sm py-2.5 px-4">Apply</button>
      </div>
    </div>
  );
};

export default CouponInput;
