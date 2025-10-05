import axios from "axios";

const API_URL = "http://localhost/platforme_KablemSPA_backEnd/public/api";

export const login = async (email: any, password: any) => {
    try {
        const response = await axios.post(`${API_URL}/user-login`, {
            email,
            password,
        });

        if (response.data.status === 200) {
            const { token, user } = response.data.data;

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", token);
            localStorage.setItem("userData", JSON.stringify(user));

            return { success: true, user };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        swal({
            title: "accés rejeter ",
            text: "Verifier votre email et mot de passe ",
            icon: "error",
        });
        return { success: false, message: "Erreur serveur" };
    }
};

// Déconnexion
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
};

// Récupérer le token
export const getToken = () => localStorage.getItem("token");

// Vérifier si connecté
export const isAuthenticated = () => !!getToken();
