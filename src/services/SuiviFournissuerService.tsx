import axios from "axios";
import { Suivifournisseur } from "../types/Suivifournisseur";

const API_URL = "http://localhost:8000/api";

export const SuiviFournisseurService = {

    async getSuiviFournisseur(): Promise<Suivifournisseur[]> {
        const response = await axios.get(API_URL + "/suiviFournisseurs");
        return response.data;
    },

    createSuiviFournisseur: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/suiviFournisseurs', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du suivi fournisseur:", error);
            throw error;
        }
    },

    async updateSuiviFournisseur(id_suivifournisseur: number , data : any) {
        try {
            const response = await axios.put(`${API_URL}/suiviFournisseurs/${id_suivifournisseur}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de suivi fournisseur :", error);
            throw error;
        }
    },

    deleteSuiviFournisseur: (id: any) => axios.delete(API_URL + `/suiviFournisseurs/${id}`),
};