// src/shared/StockCard.tsx
import React from 'react';
import { useTheme } from '../services/theme/ThemeContext';

interface StockCardProps {
  name: string;
  ticker: string;
  lastPrice: number;
  peRatio: number;
  roeRatio: number;
  marketCap: string;
  changeString: string;
  arrowUp: boolean;
}

const StockCard: React.FC<StockCardProps> = ({
  name,
  ticker,
  lastPrice,
  peRatio,
  roeRatio,
  marketCap,
  changeString,
  arrowUp,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative rounded-lg shadow-xl border-4 p-4 transition-transform duration-300 hover:scale-105 ${
        isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
      }`}
      style={{ border: '1px solid' }}
    >
      {/* Change string and arrow */}
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        <span className={`text-sm ${arrowUp ? 'text-green-500' : 'text-red-500'}`}>{changeString}</span>
        {arrowUp ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {/* Card content */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        <p className="text-sm text-gray-500 mb-1">{ticker}</p>
        <div className="mt-4">
          <p className="text-sm mb-1">
            <span className="font-medium">Last Price:</span> ${lastPrice.toFixed(2)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">PE Ratio:</span> {peRatio.toFixed(2)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">ROE Ratio:</span> {roeRatio.toFixed(2)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">Market Cap:</span> {marketCap}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
