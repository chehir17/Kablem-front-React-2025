import axios from "axios";
import { Fournisseur } from "../types/Fournisseur";

const API_URL = "http://localhost:8000/api";

export const FournisseurService = {

    async getFournisseur(): Promise<Fournisseur[]> {
        const response = await axios.get(API_URL + "/fournisseur");
        return response.data;
    },

    createFournisseur : async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/fournisseur', data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Erreur lors de la création du Fournisseur:", error);
            throw error;
        }
    },

    async updateFournisseur(id_fournisseur: number , data : any): Promise<Fournisseur> {
        try {
            const response = await axios.put(`${API_URL}/fournisseur/${id_fournisseur}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de fournisseur :", error);
            throw error;
        }
    },

    deleteFournisseur: (id: any) => axios.delete(API_URL + `/fournisseur/${id}`),
};