import React, { useState, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Options } from 'highcharts/highstock';
import { StockService } from '../services/stocks/stocks.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistoricalChart = ({ ticker }: { ticker: string }) => {
  const stockService = new StockService();

  const [chartOptions, setChartOptions] = useState<Options | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await stockService.getHistoricalData(ticker);
      if (data && data.length > 0) {
        const ohlc = [[Number,Number,Number,Number]];
        const volume = [[Number]];

        data.forEach((item: any) => {
          ohlc.push([
            item.date, // the date
            item.open, // open
            item.high, // high
            item.low, // low
            item.close, // close
          ]);

          volume.push([
            item.date, // the date
            item.volume, // the volume
          ]);
        });

        const updatedChartOptions: Options = {
          rangeSelector: {
            selected: 2,
          },
          title: {
            text: `Historical Chart for ${ticker}`,
          },
          subtitle: {
            text: 'With SMA and Volume by Price technical indicators',
          },
          yAxis: [
            {
              startOnTick: false,
              endOnTick: false,
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'OHLC',
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true,
              },
            },
            {
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'Volume',
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2,
            },
          ],
          tooltip: {
            split: true,
          },
          plotOptions: {
            series: {
              dataGrouping: {
                units: [
                  ['week', [1]],
                  ['month', [1, 2, 3, 4, 6]],
                ],
              },
            },
          },
          series: [
            {
              type: 'candlestick',
              name: ticker,
              id: ticker,
              zIndex: 2,
              data: ohlc,
            },
            {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: volume,
              yAxis: 1,
            },
          ],
        };

        setChartOptions(updatedChartOptions);
      } else {
        console.error('Invalid data structure:', data);
        toast.error('Invalid data structure. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      toast.error('Error fetching historical data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [ticker, stockService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  if (!chartOptions) {
    return     <div className="mt-4">
    <div className="flex items-center justify-center h-80">
      <div className="animate-pulse bg-gray-300 w-full h-full"></div>
    </div>
  </div>;
  }

  return (
    <div className="mt-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '800px' } }}
      />
    </div>
  );
};

export default HistoricalChart;
