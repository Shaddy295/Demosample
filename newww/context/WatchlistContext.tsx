import React, { createContext, useState, useContext } from 'react';

interface WatchlistContextType {
  favorites: string[];
  addFavorite: (ticker: string) => void;
  removeFavorite: (ticker: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (ticker: string) => {
    setFavorites((prev) => [...prev, ticker]);
  };

  const removeFavorite = (ticker: string) => {
    setFavorites((prev) => prev.filter((item) => item !== ticker));
  };

  return (
    <WatchlistContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </WatchlistContext.Provider>
  );
};
