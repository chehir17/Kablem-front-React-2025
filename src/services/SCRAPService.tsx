import axios from "axios";
import { registreSCRAP } from "../types/registreSCRAP";

const API_URL = "http://localhost:8000/api";

export const SCRAPService = {

    async getSCRAP(): Promise<registreSCRAP[]> {
        const response = await axios.get(API_URL + "/scrap");
        return response.data;
    },

    createSCRAP: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/scrap', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du registre scrap:", error);
            throw error;
        }
    },

    async updateSCRAP(id_dmpp: number , data : any): Promise<registreSCRAP> {
        try {
            const response = await axios.put(`${API_URL}/scrap/${id_dmpp}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de registre scrap :", error);
            throw error;
        }
    },

    deleteSCRAP: (id: any) => axios.delete(API_URL + `/scrap/${id}`),
};