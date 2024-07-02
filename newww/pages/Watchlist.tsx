import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { StockService } from '../services/stocks/stocks.service';
import { useWatchlist } from '../context/WatchlistContext';
import WatchlistCard from '../shared/WatchlistCard';
import { ToastContainer } from 'react-toastify';
import { useTheme } from '../services/theme/ThemeContext';
import noDataImg from 'src/assets/no-data.png';

const Watchlist: React.FC = () => {
    const { isDarkMode } = useTheme();

  const { favorites } = useWatchlist();
  const [stockDetails, setStockDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const stockService = new StockService();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const details = await Promise.all(
        favorites.map(async (ticker) => {
          try {
            const data = await stockService.getSummary(ticker);
            return { ticker, ...data };
          } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
            return null;
          }
        })
      );
      setStockDetails(details.filter((detail) => detail !== null));
      setLoading(false);
    };

    fetchDetails();
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress color="secondary" size={60} thickness={4} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
    <h1 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Watchlist</h1>
    <ToastContainer position="bottom-right" autoClose={5000} />
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded p-4">
            {/* Placeholder for loading skeleton */}
          </div>
        ))}
      </div>
    ) : (
      <>
        {stockDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stockDetails.map((stock) => (
              <WatchlistCard
                key={stock.ticker}
                ticker={stock.ticker}
                companyName={stock.companyName}
                lastPrice={parseFloat(stock.lastPrice)}
                changeString={getChangeString(parseFloat(stock.lastPrice), parseFloat(stock.prevClose))}
                arrowUp={parseFloat(stock.lastPrice) > parseFloat(stock.prevClose)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className='flex flex-col'>
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png?f=webp" className="bg-transparent" alt="No Data" />
            <p className="text-center font-bold">Your Watchlist is empty!</p>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
};

const getChangeString = (lastPrice: number, prevClose: number): string => {
  const change = lastPrice - prevClose;
  const percentage = (change / prevClose) * 100;
  return `${change.toFixed(2)} (${percentage.toFixed(2)}%)`;
};

export default Watchlist;
