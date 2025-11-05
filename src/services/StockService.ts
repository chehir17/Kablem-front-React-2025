import axios from "axios";

const url = "http://localhost:8000/api";

export class StockService {
    static async getStocks() {
        const response = await axios.get(`${url}/stocks`);
        return response.data;
    }

    static async addMouvement(mouvement: {
        id_article: number;
        quantite: number;
        type_mouvement: 'ENTREE' | 'SORTIE';
        id_lot?: number;
        source?: string;
    }) {
        const response = await axios.post(`${url}/stocks/mouvement`, mouvement);
        return response.data;
    }

    /**
     * Mettre à jour les seuils d'un stock
     */
    static async updateSeuil(id_stock: number, seuil_min: number, seuil_max?: number) {
        const response = await axios.put(`${url}/stocks/${id_stock}/seuils`, {
            seuil_min,
            seuil_max
        });
        return response.data;
    }

    /**
     * Récupérer l'historique des mouvements d'un article
     */
    static async getHistorique(id_article: number) {
        const response = await axios.get(`${url}/stocks/historique/${id_article}`);
        return response.data;
    }
}