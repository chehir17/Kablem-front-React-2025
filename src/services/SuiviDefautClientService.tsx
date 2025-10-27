import axios from "axios";
import { SuiviDefautClient } from "../types/SuiviDefautclient";

const API_URL = "http://localhost:8000/api";

export const SuiviClientService = {
  createSuviClient: async (data: any) => {
    try {
      const response = await axios.post(API_URL + '/suiviClients', data);
      return response.data;
    } catch (error: any) {
      console.error(" Erreur lors de la création du Suivi client:", error);
      throw error;
    }
  },

  async getSuiviClient(): Promise<SuiviDefautClient[]> {
    const response = await axios.get(API_URL + "/suiviClients");
    return response.data;
  },

  getById: (id: any) => axios.get(API_URL + `/suiviClients/${id}`),

  async update(id: number, data: any) {
    try {
      const response = await axios.put(API_URL + `/suiviClients/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },
  delete: (id: any) => axios.delete(API_URL + `/suiviClients/${id}`),

};