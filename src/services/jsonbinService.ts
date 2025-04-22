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
      // Khởi tạo mảng rỗng nếu chưa có dữ liệu
      if (!response.data) {
        await this.updateData(binId, []);
        return [];
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching data from JSONBin:', error);
      return [];
    }
  },

  async updateData(binId: string, data: any[]) {
    try {
      // Đảm bảo data luôn là một mảng
      const arrayData = Array.isArray(data) ? data : [];
      const response = await axios.put(
        `${JSONBIN_CONFIG.BASE_URL}/${binId}`,
        arrayData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating data in JSONBin:', error);
      throw error;
    }
  }
};