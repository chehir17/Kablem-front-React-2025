import axios from "axios";
import { Suivisupercontrole } from "../types/SuiviSuperControle";

const API_URL = "http://localhost:8000/api";

export const SuiviSuperControlesService = {

    async getSuiviSuperControles(): Promise<Suivisupercontrole[]> {
        const response = await axios.get(API_URL + "/suiviSuperControles");
        return response.data;
    },

    createSuiviSuperControles: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/suiviSuperControles', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du suivi Super Controles:", error);
            throw error;
        }
    },

    async updateSuiviSuperControles(id_dmpp: number , data : any) {
        try {
            const response = await axios.put(`${API_URL}/suiviSuperControles/${id_dmpp}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de suivi Super Controles :", error);
            throw error;
        }
    },

    deleteSuiviSuperControles: (id: any) => axios.delete(API_URL + `/suiviSuperControles/${id}`),
};