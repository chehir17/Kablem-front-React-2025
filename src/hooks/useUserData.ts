import { useEffect, useState } from "react";

export function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [etat100, setEtat100] = useState(true);
  const getConnectedUserData = () => {
    const userData = localStorage.getItem("userData");
    const storedUser = userData ? JSON.parse(userData) : null;
    console.log("Utilisateur trouvé :", storedUser);
    setUser(storedUser);
    return storedUser;
  };

  useEffect(() => {
    getConnectedUserData();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role != "user") {
      setEtat100(false);
    } else {
      setEtat100(true);
    }
  }, [user]);

  return { user, etat100, setUser, setEtat100 };
}
