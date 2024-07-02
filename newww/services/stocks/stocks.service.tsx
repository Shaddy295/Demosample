
import axios from 'axios';
import { BACKEND_ROUTES } from '../../constants/routes.constants';


export class StockService {
  searchStocks(keyword: string): Promise<any[]> {
    const API_URL = BACKEND_ROUTES.AUTOCOMPLETE;
    return axios.get<any[]>(API_URL, { params: { keyword } })
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching stocks: ${error.message}`);
      });
  }

  getStockDetails(ticker: string): Promise<any> {
    const API_URL = BACKEND_ROUTES.STOCKDETAILS;
    return axios.get<any>(`${API_URL}${ticker}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching stock details: ${error.message}`);
      });
  }

  getSummary(ticker: string): Promise<any> {
    const API_URL = BACKEND_ROUTES.SUMMARY;
    return axios.get<any>(`${API_URL}${ticker}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching summary: ${error.message}`);
      });
  }

  getDailyData(ticker: string): Promise<any> {
    const API_URL = BACKEND_ROUTES.DAILYCHART;
    return axios.get<any>(`${API_URL}${ticker}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching daily data: ${error.message}`);
      });
  }

  getTopNews(ticker: string): Promise<any> {
    const API_URL = BACKEND_ROUTES.NEWS;
    return axios.get<any>(`${API_URL}${ticker}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching top news: ${error.message}`);
      });
  }

  getHistoricalData(ticker: string): Promise<any> {
    const API_URL = BACKEND_ROUTES.HISTORYCHART;
    return axios.get<any>(`${API_URL}${ticker}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Error fetching historical data: ${error.message}`);
      });
  }
}
