import React, { useEffect, useState, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { StockService } from '../services/stocks/stocks.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface StockSummaryProps {
  ticker: string;
  companyName: string;
  exchangeCode: string;
  lastPrice: number;
  arrowUp: boolean;
  changeString: string;
  currentTime: string;
  marketStatus: boolean;
  marketClosed: string;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClose: number;
  volume: number;
  midPrice?: number;
  askPrice?: number;
  askSize?: number;
  bidPrice?: number;
  bidSize?: number;
  startDate: string;
  description: string;
}

const StockSummary: React.FC<StockSummaryProps> = ({
  ticker,
  companyName,
  exchangeCode,
  lastPrice,
  arrowUp,
  changeString,
  currentTime,
  marketStatus,
  marketClosed,
  highPrice,
  lowPrice,
  openPrice,
  prevClose,
  volume,
  midPrice,
  askPrice,
  askSize,
  bidPrice,
  bidSize,
  startDate,
  description,
}) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [isLoading, setIsLoading] = useState(true);

  const stockService = new StockService();

  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await stockService.getDailyData(ticker);
      console.log('Fetched data:', data);
      if (data) {
        mapDataToChart(data);
      } else {
        console.error('Invalid data structure:', data);
        toast.error('Invalid data structure. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error('Error fetching stock data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchStockData]);

  const mapDataToChart = (data: any) => {
    const chartData = data.map((point: any) => {
      const timestamp = typeof point.date === 'string' ? Date.parse(point.date) : point.date;
      return [timestamp, point.close];
    });

    setChartOptions({
      rangeSelector: { inputEnabled: false },
      title: { text: `${companyName} (${ticker})` },
      series: [{ type: 'line', data: chartData, color: getColor() }],
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%b %e %H:%M', Number(this.value));
          },
        },
      },
    });
  };

  const getColor = () => {
    if (changeString.startsWith('-')) return 'red';
    if (changeString.startsWith('+')) return 'green';
    return 'black';
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0">
        {/* Stock Information Section */}
        <div className="w-full md:w-1/2 md:pr-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap justify-between">
              <div>
                <p><strong>High Price:</strong> {highPrice}</p>
                <p><strong>Low Price:</strong> {lowPrice}</p>
                <p><strong>Open Price:</strong> {openPrice}</p>
                <p><strong>Prev. Close:</strong> {prevClose}</p>
                <p><strong>Volume:</strong> {volume}</p>
              </div>
              {!marketStatus && (
                <div>
                  <p><strong>Mid Price:</strong> {midPrice}</p>
                  <p><strong>Ask Price:</strong> {askPrice}</p>
                  <p><strong>Ask Size:</strong> {askSize}</p>
                  <p><strong>Bid Price:</strong> {bidPrice}</p>
                  <p><strong>Bid Size:</strong> {bidSize}</p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-center text-2xl font-bold">Company's Description</h2>
              <p><strong>Start Date:</strong> {startDate}</p>
              <p className="text-justify">{description}</p>
            </div>
          </div>
        </div>
        {/* Chart Section */}
        <div className="w-full md:w-1/2">
          {isLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-pulse bg-gray-300 w-full h-full"></div>
            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              containerProps={{ style: { width: '100%', height: '400px' } }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
