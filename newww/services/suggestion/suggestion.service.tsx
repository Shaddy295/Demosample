// suggestionService.ts
// types.ts (or suggestionService.ts if you prefer)
export interface Suggestion {
    action: 'buy' | 'sell';
    date: string;
    price: number;
    shares: number;
  }
  


export const getDetailedBuySellActions = (
  prices: [number, number][], 
  initialCapital: number
): { actions: Suggestion[], maxProfit: number } => {
  const actions: Suggestion[] = [];
  let capital = initialCapital;
  let shares = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i][1] > prices[i - 1][1]) {
      // Buy yesterday, sell today
      if (shares === 0) {
        shares = Math.floor(capital / prices[i - 1][1]);
        capital -= shares * prices[i - 1][1];
        actions.push({
          action: 'buy',
          date: new Date(prices[i - 1][0]).toLocaleDateString(),
          price: prices[i - 1][1],
          shares: shares,
        });
      }
      // Sell today
      capital += shares * prices[i][1];
      actions.push({
        action: 'sell',
        date: new Date(prices[i][0]).toLocaleDateString(),
        price: prices[i][1],
        shares: shares,
      });
      shares = 0; // Reset shares after selling
    }
  }

  // If shares remain, sell on the last day
  if (shares > 0) {
    capital += shares * prices[prices.length - 1][1];
    actions.push({
      action: 'sell',
      date: new Date(prices[prices.length - 1][0]).toLocaleDateString(),
      price: prices[prices.length - 1][1],
      shares: shares,
    });
  }

  return { actions, maxProfit: capital - initialCapital };
};

  