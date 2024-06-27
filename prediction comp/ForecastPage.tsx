import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';
import { predictNextMonth } from '../services/prediction/stockPredict.service';

// Type definition for API response
interface PredictionResponse {
  ticker: string;
  predictions: { [date: string]: number };
  error?: string;
}

const Forecast: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>(); // Get the ticker parameter from the URL
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        if (!ticker) {
          return; // Handle the case where ticker is undefined, maybe show an error or redirect
        }
  
        const data = await predictNextMonth(ticker);
  
        if (data.error) {
          toast.error(data.error);
          return;
        }
  
        // Convert dates to timestamps and prepare the data for Highcharts
        const forecastData: [number, number][] = Object.entries(data.predictions).map(([date, price]) => [
            new Date(date).getTime(),
            Number(price), // Ensure price is cast to number
          ]);
          
        // Get the range of dates
        const dataCoverageStart = forecastData.length ? new Date(forecastData[0][0]) : null;
        const dataCoverageEnd = forecastData.length ? new Date(forecastData[forecastData.length - 1][0]) : null;
  
        setChartOptions({
            chart:{
                zoomType:'x'
            },
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
                count: 10,
                text: '10D',
              }, {
                type: 'week',
                count: 1,
                text: '1W',
              },  {
                type: 'all',
                text: '1M',
              }
            ] as Highcharts.RangeSelectorButtonsOptions[],  // Explicitly cast to resolve TypeScript error
          },
        });
  
      } catch (error) {
        toast.error('Error fetching prediction.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchForecast();
  }, [ticker]); // Ensure useEffect runs whenever `ticker` changes
  
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress color="secondary" size={60} thickness={4} />
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default Forecast;
