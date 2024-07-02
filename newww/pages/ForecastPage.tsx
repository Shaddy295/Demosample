import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { CircularProgress, TextField, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import { predictNextMonth } from '../services/prediction/stockPredict.service';
import { getDetailedBuySellActions, Suggestion } from '../services/suggestion/suggestion.service';
import { useTheme } from '../services/theme/ThemeContext';

interface PredictionResponse {
  ticker: string;
  predictions: { [date: string]: number };
  error?: string;
}

const Forecast: React.FC = () => {
    const { isDarkMode } = useTheme();

  const { ticker } = useParams<{ ticker: string }>();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [isLoading, setIsLoading] = useState(true);
  const [initialCapital, setInitialCapital] = useState(1000); // Default capital
  const [actions, setActions] = useState<Suggestion[]>([]);
  const [maxProfit, setMaxProfit] = useState<number>(0);
  const initialCapitalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        if (!ticker) {
          return;
        }

        const data = await predictNextMonth(ticker);

        if (data.error) {
          toast.error(data.error);
          return;
        }

        const forecastData: [number, number][] = Object.entries(data.predictions).map(([date, price]) => [
          new Date(date).getTime(),
          Number(price),
        ]);

        // Get the max profit and detailed actions
        const { actions, maxProfit } = getDetailedBuySellActions(forecastData, initialCapital);
        setActions(actions);
        setMaxProfit(maxProfit);

        setChartOptions({
          title: {
            text: `Stock Price Prediction for ${ticker}`,
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Date',
            },
          },
          yAxis: {
            title: {
              text: 'Price',
            },
          },
          series: [{
            name: ticker,
            data: forecastData,
            type: 'line',
            tooltip: {
              valueDecimals: 2,
            },
          }],
          rangeSelector: {
            enabled: true,
            selected: 1,
            buttons: [
              {
                type: 'day',
                count: 1,
                text: '1d',
              }, {
                type: 'week',
                count: 1,
                text: '1w',
              }, {
                type: 'month',
                count: 1,
                text: '1m',
              }, {
                type: 'all',
                text: 'All',
              }
            ] as Highcharts.RangeSelectorButtonsOptions[],
          },
        });

      } catch (error) {
        toast.error('Error fetching prediction.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [ticker, initialCapital]);

  const handleInputChange = () => {
    if (initialCapitalInputRef.current) {
      setInitialCapital(Number(initialCapitalInputRef.current.value));
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Typography variant="h4" gutterBottom className="font-bold text-center mb-4">
        Stock Price Forecast for {ticker}
      </Typography>
      
      <div className="flex items-center justify-center mb-4 p-3">
        <TextField
          label="Initial Capital"
        //   className="bg-gray-400 rounded-xl border"
        //   className={`mt-4 ${isDarkMode ? 'text-white bg-gray-800' : 'text-black bg-gray-100'}`}
          InputLabelProps={{
            className: isDarkMode ? 'text-white' : 'text-black',
          }}
          InputProps={{
            className: isDarkMode ? 'text-white' : 'text-black',
          }}
          type="number"
          inputRef={initialCapitalInputRef}
          defaultValue={initialCapital.toString()}
          variant="outlined"
        //   className="mr-4"
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Get Suggestions
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
          <CircularProgress color="secondary" size={60} thickness={4} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={chartOptions}
            />
          </div>
          <div className="mt-4">
            <Typography variant="h5" gutterBottom className="font-bold text-center mb-4">
              Buy/Sell Suggestions
            </Typography>
            {actions.length === 0 ? (
              <Typography variant="body1" className="text-center">
                No suggestions available.
              </Typography>
            ) : (
                <ul className="list-none p-0">
                {actions.map((action, index) => (
              <li key={index} className={`p-2 shadow rounded mt-2 ${isDarkMode ? 'text-white bg-gray-900 border shadow-md shadow-slate-400' : ' shadow-md shadow-slate-500'}`}>
              <Typography variant="body1">
                {action.action === 'buy' ? 'Buy' : 'Sell'} on {action.date} at ${action.price.toFixed(2)}.
                {action.action === 'buy' && (
                  <> Buy shares: {action.shares.toFixed(2)}</>
                )}
              </Typography>
            </li>
            
             
                ))}
              </ul>
              
            )}
            <Typography variant="h6" className="font-bold text-green-500 mt-4 text-center">
              Max Profit: ${maxProfit.toFixed(2)}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

export default Forecast;
