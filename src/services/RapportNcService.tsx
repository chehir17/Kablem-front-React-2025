import axios from "axios";
import { RapportNC } from "../types/RapportNC";

const API_URL = "http://localhost:8000/api";

export const RapportNcService = {
  createRapportNc: async (data: any) => {
    try {
      const response = await axios.post(API_URL + '/rapportnc', data);
      return response.data;
    } catch (error: any) {
      console.error(" Erreur lors de la création du Rapport Non Conformité:", error);
      throw error;
    }
  },

  async getRapport(): Promise<RapportNC[]> {
    const response = await axios.get(API_URL + "/rapportnc");
    return response.data;
  },

  getById: (id: any) => axios.get(API_URL + `/rapportnc/${id}`),

  async update(id: number, data: any) {
    try {
      const response = await axios.put(API_URL + `/rapportnc/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },
  delete: (id: any) => axios.delete(API_URL + `/rapportnc/${id}`),

};