import axios from "axios";
import { ACAP } from "../types/ACAP";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export const ACAPService = {

  async getACAP(): Promise<ACAP[]> {
    const response = await api.get("/ac_ap");
    return response.data;
  },

  getById: (id: any) => api.get(`/ac_ap/${id}`),

  create: async (data: FormData) => {
    return api.post("/ac_ap", data);
  },

  async update(id: number, data: any) {
    try {
      const response = await api.put(`/ac_ap/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },

  delete: (id: any) => api.delete(`/ac_ap/${id}`),
};
