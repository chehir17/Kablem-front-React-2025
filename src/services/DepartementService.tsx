import axios from "axios";
import {Departement} from "../types/Departement"

const api = axios.create({
  baseURL: "http://localhost/platforme_KablemSPA_backEnd/public/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export const DepartementService = {

  async getDepartements(): Promise<Departement[]> {
    const response = await api.get("/departements");
    return response.data;
  },

  getById: (id_departement: any) => api.get(`/departements/${id_departement}`),

  create: (data: any) => api.post("/departements", data),

  async update(id: number, data: any) {
    try {
      const response = await api.put(`/departements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },

  delete: (id: any) => api.delete(`/departements/${id}`),
};
