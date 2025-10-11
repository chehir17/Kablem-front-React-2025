import axios from "axios";
import { Utilisateur } from "../types/Utilisateur"

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter un middleware pour inclure un token d'authentification (JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const UserService = {

  async getUsers(): Promise<Utilisateur[]> {
    const response = await api.get("/user");
    return response.data;
  },

  getById: (id: any) => api.get(`/user/${id}`),

  create: async (data: FormData) => {
    return api.post("/user", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async update(id: number, data: any) {
    try {
      const response = await api.put(`/user/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },

  delete: (id: any) => api.delete(`/user/${id}`),
};
