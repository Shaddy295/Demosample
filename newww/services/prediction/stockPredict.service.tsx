import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const predictNextMonth = async (ticker:string) => {
  try {
    const response = await axios.post(`${API_URL}/predict/next_month`, { ticker });
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};
