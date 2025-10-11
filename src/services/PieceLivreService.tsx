import axios from "axios";
import { Ligne } from "../types/Ligne";
import { Piece } from "../types/Piece";


const API_URL = "http://localhost:8000/api";

export const PieceLivreService = {

    async getPieceLivre(): Promise<Piece[]> {
        const response = await axios.get(API_URL + "/piece");
        return response.data;
    },

    createPieceLivre : async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/piece', data);
            return response.data;
        } catch (error: any) {
            console.error(" Erreur lors de la création du Pieces Livre:", error);
            throw error;
        }
    },

    async updatePieceLivre(id_piece : number , data : any): Promise<Piece> {
        try {
            const response = await axios.put(`${API_URL}/piece/${id_piece }`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de piece :", error);
            throw error;
        }
    },

    deletePiece: (id: any) => axios.delete(API_URL + `/piece/${id}`),
};