import axios from "axios";
import { Ligne } from "../types/Ligne";

const API_URL = "http://localhost:8000/api";

export const LigneService = {

    async getLigne(): Promise<Ligne[]> {
        const response = await axios.get(API_URL + "/ligne");
        return response.data;
    },

    createLigne : async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/ligne', data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la création du Ligne:", error);
            throw error;
        }
    },

    async updateLigne(id_ligne: number , data : any): Promise<Ligne> {
        try {
            const response = await axios.put(`${API_URL}/ligne/${id_ligne}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de ligne :", error);
            throw error;
        }
    },

    deleteLigne: (id: any) => axios.delete(API_URL + `/ligne/${id}`),
};