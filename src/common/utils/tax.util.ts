export const calculateWithdrawalAmount = (amount: number) => {
  const taxRate = 0.033; // 3.3%
  const tax = Math.floor(amount * taxRate); // Truncate decimals
  const actualAmount = amount - tax;

  return {
    originalAmount: amount,
    tax,
    actualAmount,
  };
};
