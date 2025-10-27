import axios from "axios";
import { Planaction } from "../types/PlanAction";

const API_URL = "http://localhost:8000/api";

export const PlanActionService = {

  async getPlanActionAdmin(): Promise<Planaction[]> {
    const response = await axios.get(API_URL + "/planActions");
    return response.data;
  },

  async getPlanActionMedium(): Promise<Planaction[]> {
    const response = await axios.get(API_URL + "/index100");
    return response.data;
  },

  createPlanAction: async (data: any) => {
    try {
      const response = await axios.post(API_URL + "/planActions", data);
      return response.data;
    } catch (error: any) {
      console.error(" Erreur lors de la création du plan d’action :", error);
      throw error;
    }
  },

  async updateplanAction(id_planaction: number, data: any): Promise<Planaction> {
    try {
      const response = await axios.put(`${API_URL}/planActions/${id_planaction}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de plan d'action :", error);
      throw error;
    }
  },

  async updatestatus(id_planaction: number, status: string, progress: number) {
    try {
      const payload = { status, progress };

      console.log("➡️ Données envoyées :", payload);

      const response = await axios.put(`${API_URL}/status/${id_planaction}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Réponse serveur :", response.data);
      return response.data;
    } catch (error: any) {
      console.error(" Erreur lors de la mise à jour de status :", error);
      throw error;
    }
  },

  deletePlanAction: (id: any) => axios.delete(API_URL + `/planActions/${id}`),

};