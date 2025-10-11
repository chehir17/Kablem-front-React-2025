import axios from "axios";

const API_URL = "http://localhost:8000/api/planActions";

export const PlanActionService = {
  createPlanAction: async (data: any) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erreur lors de la création du plan d’action :", error);
      throw error;
    }
  },
};