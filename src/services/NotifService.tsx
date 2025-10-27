import axios from "axios";
import { Notif } from "../types/Notif";

const API_URL = "http://localhost:8000/api";

export const NotifService = {

    async getNotif(): Promise<Notif[]> {
        const response = await axios.get(API_URL + "/addNotif");
        return response.data;
    },

    getById: (id : any ) => axios.get(API_URL + `/addNotif/${id}`),

    createNotif: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/addNotif', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du Notif:", error);
            throw error;
        }
    },

    async updateNotif(id_notif: number, data: any): Promise<Notif> {
        try {
            const response = await axios.put(`${API_URL}/addNotif/${id_notif}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de notif :", error);
            throw error;
        }
    },

    deleteNotif: (id: any) => axios.delete(API_URL + `/addNotif/${id}`),
};