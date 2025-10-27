import axios from "axios";
import { Lot } from "../types/Lot";

const API_URL = "http://localhost:8000/api";

export const LotService = {

    async getLot(): Promise<Lot[]> {
        const response = await axios.get(API_URL + "/lot");
        return response.data;
    },

    createLot: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/lot', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du l'Article:", error);
            throw error;
        }
    },

    async updateLot(id_lot: number , data : any): Promise<Lot> {
        try {
            const response = await axios.put(`${API_URL}/lot/${id_lot}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour du lot :", error);
            throw error;
        }
    },

    deleteLot: (id: any) => axios.delete(API_URL + `/lot/${id}`),
};