import React, { useEffect, useState, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import { StockService } from '../services/stocks/stocks.service';
import { useTheme } from '../services/theme/ThemeContext';
import { Tab, Tabs, Typography, Box } from '@mui/material';
import StockSummary from './StockSummary';
import HistoricalChart from './HistoricalChart';
import NewsComponent from './NewsComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@material-ui/core';
import { useWatchlist } from '../context/WatchlistContext';

interface DetailsProps {
  tickerSymbol: string;
}

const Details: React.FC<DetailsProps> = ({ tickerSymbol }) => {
  const { isDarkMode } = useTheme();
  const [companyName, setCompanyName] = useState('');
  const [exchangeCode, setExchangeCode] = useState('');
  const [lastPrice, setLastPrice] = useState(0);
  const [arrowUp, setArrowUp] = useState(false);
  const [changeString, setChangeString] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [marketStatus, setMarketStatus] = useState(true);
  const [marketClosed, setMarketClosed] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [incorrectTicker, setIncorrectTicker] = useState(false);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);
  const [openPrice, setOpenPrice] = useState(0);
  const [prevClose, setPrevClose] = useState(0);
  const [volume, setVolume] = useState(0);
  const [midPrice, setMidPrice] = useState(0);
  const [askPrice, setAskPrice] = useState(0);
  const [askSize, setAskSize] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const [bidSize, setBidSize] = useState(0);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [newsData, setNewsData] = useState<any[]>([]);
  const stockService = new StockService();
  const { favorites, addFavorite, removeFavorite } = useWatchlist(); // Use the context

  useEffect(() => {
    if (tickerSymbol) {
      setDetailsLoaded(false);
      setSummaryLoaded(false);
      fetchStockDetails(tickerSymbol);
      loadStockDetails(tickerSymbol);
      getNewsData(tickerSymbol);
    }
  }, [tickerSymbol]);

  const fetchStockDetails = useCallback(async (ticker: string) => {
    setIsLoading(true);
    setIncorrectTicker(false);

    try {
      const dataobj = await stockService.getStockDetails(ticker);

      if (dataobj.length > 0) {
        setCompanyName(dataobj[0].name || 'N/A');
        setExchangeCode(dataobj[0].exchangeCode || 'N/A');
        setDetailsLoaded(true);
        setDescription(dataobj[0].description);
        setStartDate(dataobj[0].startDate);
      } else {
        setIncorrectTicker(true);
        toast.error('Error: Stock details not found.');
      }
    } catch (error) {
      setIsLoading(false);
      setIncorrectTicker(true);
      toast.error('Error fetching stock details.');
    }
  }, []);

  const loadStockDetails = useCallback(async (ticker: string) => {
    try {
      const data = await stockService.getSummary(ticker);

      setLastPrice(parseFloat(data.lastPrice) || 0);
      setArrowUp(parseFloat(data.lastPrice) > parseFloat(data.prevClose));
      setChangeString(getChangeString(parseFloat(data.lastPrice), parseFloat(data.prevClose)));
      setCurrentTime(data.currentTimeStamp);
      setMarketStatus(data.marketStatus);
      setMarketClosed(data.timestamp || '');
      setHighPrice(parseFloat(data.highPrice) || 0);
      setLowPrice(parseFloat(data.lowPrice) || 0);
      setOpenPrice(parseFloat(data.openPrice) || 0);
      setPrevClose(parseFloat(data.prevClose) || 0);
      setVolume(parseFloat(data.volume) || 0);
      setMidPrice(parseFloat(data.midPrice) || 0);
      setAskPrice(parseFloat(data.askPrice) || 0);
      setAskSize(parseFloat(data.askSize) || 0);
      setBidPrice(parseFloat(data.bidPrice) || 0);
      setBidSize(parseFloat(data.bidSize) || 0);

      setSummaryLoaded(true);
    } catch (error) {
      console.error('Error loading stock summary:', error);
      toast.error('Error loading stock summary.');
    }
  }, []);

  const getNewsData: (ticker: string) => Promise<void> = useCallback(async (ticker: string) => {
    try {
      const data = await stockService.getTopNews(ticker);
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news data:', error);
      toast.error('Error fetching news data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (detailsLoaded && summaryLoaded) {
      setIsLoading(false);
    }
  }, [detailsLoaded, summaryLoaded]);

  const getChangeString = (lastPrice: number, prevClose: number): string => {
    const change = lastPrice - prevClose;
    const percentage = (change / prevClose) * 100;
    return `${change.toFixed(2)} (${percentage.toFixed(2)}%)`;
  };

  const getColor = () => (arrowUp ? 'green' : 'red');

  const toggleFavorite = () => {
    if (favorites.includes(tickerSymbol)) {
      removeFavorite(tickerSymbol);
    } else {
      addFavorite(tickerSymbol);
    }
    setIsFavorite(!isFavorite)
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className={`pb-3 `}>
      <ToastContainer />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress color="secondary" size={60} thickness={4} />
        </div>
      ) : (
        <div>
          <div className="flex flex-row justify-between">
            <div className="w-1/2 items-center justify-center p-5">
              <div className="flex items-start">
                <div className="me-2">
                  <p className="text-3xl font-semibold">{tickerSymbol}</p>
                </div>
                <div>
                  {favorites.includes(tickerSymbol) ? (
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      className="bi bi-star-fill text-yellow-500 cursor-pointer"
                      onClick={toggleFavorite}
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                  ) : (
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      className="bi bi-star text-gray-500 cursor-pointer"
                      onClick={toggleFavorite}
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xl">{companyName}</p>
              <p className="text-xl uppercase">{exchangeCode}</p>
              <button
                className="mt-2 px-6 py-3 rounded-lg bg-green-600 text-white"
                onClick={() => console.log('Open Purchase Modal')}
              >
                Buy
              </button>
            </div>
            <div className="w-1/2 text-right p-8">
              <div>
                <div className="text-4xl" style={{ color: getColor(), fontSize: '40px', padding: '15px' }}>
                  {lastPrice}
                </div>
                <div className="flex items-center justify-end">
                  {arrowUp ? (
                    <svg
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 16 16"
                      className="bi bi-caret-up-fill"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="green"
                        d="M7.247 4.86l-4.796 5.481c-.566.648-.157 1.659.718 1.659h9.592c.875 0 1.284-1.011.718-1.659l-4.796-5.481a1.003 1.003 0 0 0-1.436 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 16 16"
                      className="bi bi-caret-down-fill"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="red"
                        d="M7.247 11.14l4.796-5.481c.566-.648.157-1.659-.718-1.659H2.733c-.875 0-1.284 1.011-.718 1.659l4.796 5.481a1.003 1.003 0 0 0 1.436 0z"
                      />
                    </svg>
                  )}
                  <span className="ms-2" style={{ color: getColor() }}>
                    {changeString}
                  </span>
                </div>
                <p className="text-sm mt-3">As of {currentTime}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            {marketStatus ? (
              <p className="text-lg text-green-600">Market is Open</p>
            ) : (
              <p className="text-lg text-red-600">Market is closed</p>
            )}
          </div>
          <div className="mt-6">
          <Tabs
  value={tabIndex}
  onChange={handleChangeTab}
  variant="fullWidth"
  centered
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiTabs-flexContainer': {
      width: '100%',
      justifyContent: 'space-between',
    },
    '& .Mui-selected': {
      color: '#045c9f', // Color of the selected tab label
      fontWeight: 'bold', // Example: Apply bold font weight
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#045c9f', // Color of the indicator (line beneath the selected tab)
    },
  }}
>
  <Tab label="Summary" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
  <Tab label="Top News" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
  <Tab label="Charts" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
</Tabs>

            <TabPanel value={tabIndex} index={0}>
              <StockSummary
                ticker={tickerSymbol}
                companyName={companyName}
                exchangeCode={exchangeCode}
                lastPrice={lastPrice}
                arrowUp={arrowUp}
                changeString={changeString}
                currentTime={currentTime}
                marketStatus={marketStatus}
                marketClosed={marketClosed}
                highPrice={highPrice}
                lowPrice={lowPrice}
                openPrice={openPrice}
                prevClose={prevClose}
                volume={volume}
                midPrice={midPrice}
                askPrice={askPrice}
                askSize={askSize}
                bidPrice={bidPrice}
                bidSize={bidSize}
                startDate={startDate}
                description={description}
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              {newsData.length > 0 ? (
                <div className="row">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newsData.map((newsItem, index) => (
                      <div key={index} className="col-span-1">
                        <NewsComponent newsData={newsItem} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <NewsSkeleton /> // Render skeleton loader when newsData is empty
              )}
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <HistoricalChart ticker={tickerSymbol} />
            </TabPanel>
          </div>
        </div>
      )}
    </div>
  );
};

const NewsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((_, index) => (
      <div key={index} className="col-span-1 p-4 rounded-md">
        <div className="animate-pulse h-20 bg-gray-300 rounded-md"></div>
        <div className="flex justify-between mt-2">
          {/* <div className="w-2/3 h-4 bg-gray-300 rounded-md"></div> */}
          {/* <div className="w-1/3 h-4 bg-gray-300 rounded-md"></div> */}
        </div>
      </div>
    ))}
  </div>
);

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default Details;
