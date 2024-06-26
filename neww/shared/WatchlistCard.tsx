import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../services/theme/ThemeContext';

interface WatchlistCardProps {
  ticker: string;
  companyName: string;
  lastPrice: number;
  changeString: string;
  arrowUp: boolean;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ ticker, companyName, lastPrice, changeString, arrowUp }) => {
  const { isDarkMode } = useTheme();
  const { removeFavorite } = useWatchlist();

  return (
    <div className={`shadow-md rounded-lg p-4 m-2 w-80 ${isDarkMode ? 'bg-gray-900 text-white border-white' : 'bg-white text-gray-900 border-gray-300'}`}
    style={{ border: '1px solid' }}

    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{ticker}</h3>
        <button
          className="ml-4 text-red-600 hover:text-red-800"
          onClick={() => removeFavorite(ticker)}
          title="Remove from watchlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-md text-gray-600">{companyName}</p>
      <p className="text-xl font-bold mt-2">{lastPrice.toFixed(2)}</p>
      <p className={`text-sm font-semibold ${arrowUp ? 'text-green-600' : 'text-red-600'}`}>{changeString}</p>
    </div>
  );
};

export default WatchlistCard;
