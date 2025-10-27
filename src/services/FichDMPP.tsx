import axios from "axios";
import { FicheDMPP } from "../types/FichDMPP";

const API_URL = "http://localhost:8000/api";

export const FichDMPPService = {

    async getDMPP(): Promise<FicheDMPP[]> {
        const response = await axios.get(API_URL + "/dmpp");
        return response.data;
    },

    createDMPP: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/dmpp', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du fiche DMPP:", error);
            throw error;
        }
    },

    async updateDMPP(id_dmpp: number , data : any): Promise<FicheDMPP> {
        try {
            const response = await axios.put(`${API_URL}/dmpp/${id_dmpp}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de fich dmpp :", error);
            throw error;
        }
    },

    deleteDMPP: (id: any) => axios.delete(API_URL + `/dmpp/${id}`),
};