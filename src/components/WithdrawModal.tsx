import React, { useState } from 'react';
import { X, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WithdrawModalProps {
  onClose: () => void;
  availablePoints: number;
  onWithdraw?: (amount: number) => void;
}

export default function WithdrawModal({ onClose, availablePoints, onWithdraw }: WithdrawModalProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseInt(withdrawAmount, 10);
    
    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > availablePoints) {
      alert('Insufficient points');
      return;
    }

    setIsLoading(true);
    try {
      if (onWithdraw) {
        onWithdraw(amount);
      }
      setWithdrawAmount('');
      setTimeout(onClose, 500);
    } catch (error) {
      console.error('Error withdrawing points:', error);
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto w-full border border-secondary/10"
    >
      <div className="flex justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-container rounded-xl flex items-center justify-center text-white shrink-0">
            <TrendingDown size={18} className="sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-on-surface truncate">Withdraw Points</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant shrink-0 transition-colors"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-3 sm:space-y-4">
        {/* Available Balance */}
        <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 sm:p-6">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-on-surface">{availablePoints.toLocaleString()}</span>
            <span className="text-lg text-on-surface-variant">Rs.</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Quick Withdraw</p>
          <div className="grid grid-cols-2 gap-2">
            {[100, 250, 500, 1000].map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setWithdrawAmount(String(amount))}
                disabled={amount > availablePoints}
                className="bg-surface-container hover:bg-surface-bright disabled:opacity-30 disabled:cursor-not-allowed border border-outline-variant rounded-xl py-2 sm:py-3 font-semibold text-sm transition-all active:scale-95"
              >
                Rs. {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Custom Amount</label>
          <input 
            type="number" 
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount in Rs."
            min="1"
            max={availablePoints}
            className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
          />
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 flex gap-2 sm:gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 sm:w-5 sm:h-5 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-700">
            <p className="font-semibold mb-1">Please note:</p>
            <p>Withdrawn points will be recorded in your transaction history.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 sm:h-14 bg-surface-container text-on-surface rounded-2xl font-bold text-sm sm:text-base transition-all hover:bg-surface-bright active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !withdrawAmount}
            className="flex-1 h-12 sm:h-14 bg-secondary text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-secondary-container disabled:opacity-50 transition-all active:scale-95 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <TrendingDown size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Withdraw</span>
                <span className="sm:hidden">Go</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
