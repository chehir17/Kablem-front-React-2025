import axios from "axios";
import { data } from "react-router";
import { Client } from "../types/Client";

const API_URL = "http://localhost:8000/api";

export const ClientService = {

    async getClient(): Promise<Client[]> {
        const response = await axios.get(API_URL + "/client");
        return response.data;
    },

    createClient: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/client', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du client:", error);
            throw error;
        }
    },

    async updateClient(id_client: number , data : any): Promise<Client> {
        try {
            const response = await axios.put(`${API_URL}/client/${id_client}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de client :", error);
            throw error;
        }
    },

    deleteClient: (id: any) => axios.delete(API_URL + `/client/${id}`),
};