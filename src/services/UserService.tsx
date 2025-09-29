import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Ajouter un middleware pour inclure un token d'authentification (JWT)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const UserService = {

    getAll: () => api.get("/users"),

    getById: (id: any) => api.get(`/users/${id}`),

    create: (data: any) => api.post("/users", data),

   async update(id: number, data: any) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },

    delete: (id: any) => api.delete(`/users/${id}`),
};
