import React, { useCallback, useEffect, useState } from 'react';
import { StockService } from '../services/stocks/stocks.service';
import { useTheme } from '../services/theme/ThemeContext';
import StockCard from '../shared/StockCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const topStocks = [
  { name: 'Apple Inc.', ticker: 'AAPL', peRatio: 28.12, roeRatio: 147.34, marketCap: '$2.41T' },
  { name: 'Microsoft Corporation', ticker: 'MSFT', peRatio: 33.15, roeRatio: 45.78, marketCap: '$2.01T' },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', peRatio: 29.42, roeRatio: 25.37, marketCap: '$1.59T' },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN', peRatio: 55.21, roeRatio: 13.44, marketCap: '$1.34T' },
  { name: 'Tesla, Inc.', ticker: 'TSLA', peRatio: 96.74, roeRatio: 27.46, marketCap: '$0.85T' },
  { name: 'NVIDIA Corporation', ticker: 'NVDA', peRatio: 52.63, roeRatio: 47.38, marketCap: '$1.07T' },
  { name: 'Meta Platforms, Inc.', ticker: 'META', peRatio: 35.67, roeRatio: 29.65, marketCap: '$0.73T' },
  { name: 'Netflix, Inc.', ticker: 'NFLX', peRatio: 41.52, roeRatio: 23.19, marketCap: '$0.23T' },
  { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', peRatio: 20.47, roeRatio: 12.98, marketCap: '$0.78T' },
  { name: 'JPMorgan Chase & Co.', ticker: 'JPM', peRatio: 11.68, roeRatio: 12.92, marketCap: '$0.43T' },
  { name: 'Wells Fargo & Company', ticker: 'WFC', peRatio: 12.35, roeRatio: 10.18, marketCap: '$0.29T' },
];

interface StockSummary {
  lastPrice: number;
  changeString: string;
  arrowUp: boolean;
}

const TopFinancialStocks: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [stockSummaries, setStockSummaries] = useState<Record<string, StockSummary>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const stockService = new StockService();

  useEffect(() => {
    loadStockSummaries();
  }, []);

  const loadStockSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const summaries: Record<string, StockSummary> = {};
      await Promise.all(
        topStocks.map(async (stock) => {
          try {
            const data = await stockService.getSummary(stock.ticker);
            summaries[stock.ticker] = {
              lastPrice: parseFloat(data.lastPrice) || 0,
              changeString: getChangeString(parseFloat(data.lastPrice), parseFloat(data.prevClose)),
              arrowUp: parseFloat(data.lastPrice) > parseFloat(data.prevClose),
            };
          } catch (error) {
            console.error(`Error loading summary for ${stock.ticker}:`, error);
            toast.error(`Error loading summary for ${stock.ticker}`);
          }
        })
      );
      setStockSummaries(summaries);
    } catch (error) {
      console.error('Error loading stock summaries:', error);
      toast.error('Error loading stock summaries');
    } finally {
      setLoading(false);
    }
  }, []);

  const getChangeString = (lastPrice: number, prevClose: number): string => {
    if (prevClose === 0) return '';
    const change = lastPrice - prevClose;
    const percentage = (change / prevClose) * 100;
    return `${change.toFixed(2)} (${percentage.toFixed(2)}%)`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top Financial Stocks</h1>
      <ToastContainer position="bottom-right" autoClose={5000} />
      {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: topStocks.length }).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded p-4">
                    <div className="animate-pulse h-8 w-4/5 bg-gray-300 mb-2"></div>
                    <div className="animate-pulse h-4 w-2/3 bg-gray-300"></div>
                  </div>
                ))}
              </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topStocks.map((stock) => (
            <StockCard
              key={stock.ticker}
              name={stock.name}
              ticker={stock.ticker}
              lastPrice={stockSummaries[stock.ticker]?.lastPrice ?? 0}
              peRatio={stock.peRatio}
              roeRatio={stock.roeRatio}
              marketCap={stock.marketCap}
              changeString={stockSummaries[stock.ticker]?.changeString ?? ''}
              arrowUp={stockSummaries[stock.ticker]?.arrowUp ?? false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopFinancialStocks;
