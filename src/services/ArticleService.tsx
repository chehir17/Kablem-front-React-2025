import axios from "axios";
import { Article } from "../types/Articles";
import { data } from "react-router";

const API_URL = "http://localhost:8000/api";

export const ArticleService = {

    async getArticles(): Promise<Article[]> {
        const response = await axios.get(API_URL + "/articles");
        return response.data;
    },

    createArticle: async (data: any) => {
        try {
            const response = await axios.post(API_URL + '/articles', data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Erreur lors de la création du l'Article:", error);
            throw error;
        }
    },

    async updateArticle(id_article: number , data : any): Promise<Article> {
        try {
            const response = await axios.put(`${API_URL}/articles/${id_article}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de l'article :", error);
            throw error;
        }
    },

    deleteArticle: (id: any) => axios.delete(API_URL + `/articles/${id}`),
};