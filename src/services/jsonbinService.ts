import axios from 'axios';
import { JSONBIN_CONFIG } from '../config/jsonbin';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_CONFIG.API_KEY,
  'X-Bin-Meta': 'false'
});

export const jsonbinService = {
  async getData(binId: string) {
    try {
      const response = await axios.get(
        `${JSONBIN_CONFIG.BASE_URL}/${binId}/latest`,
        { headers: getHeaders() }
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching data from JSONBin:', error);
      return [];
    }
  },

  async updateData(binId: string, data: any) {
    try {
      const response = await axios.put(
        `${JSONBIN_CONFIG.BASE_URL}/${binId}`,
        data,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating data in JSONBin:', error);
      throw error;
    }
  }
};