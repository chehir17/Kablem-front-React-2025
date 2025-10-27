import axios from "axios";

const API_URL = "http://localhost:8000/api/events";

export const EventService = {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async create(eventData: any) {
    const response = await axios.post(API_URL, eventData);
    return response.data;
  },

  async delete(id: number) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
