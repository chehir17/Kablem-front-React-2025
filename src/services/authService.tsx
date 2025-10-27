import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Login utilisateur
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/user-login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const { status, data, message } = response.data;


    if (status === 200 && data?.token) {
      // Stocker JWT + infos utilisateur dans localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      return { success: true, user: data.user, token: data.token };
    } else {
      return { success: false, message: message || "Email ou mot de passe incorrect." };
    }
  } catch (error: any) {
    console.error(" Login error:", error);
    const msg = error.response?.data?.message || "Erreur de connexion au serveur";
    return { success: false, message: msg };
  }
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("isLoggedIn");
};

// Récupérer le token
export const getToken = () => localStorage.getItem("token");

// Vérifier si connecté
export const isAuthenticated = () => !!getToken();
