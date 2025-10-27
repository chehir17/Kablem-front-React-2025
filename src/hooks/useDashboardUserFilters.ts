import { useEffect, useState } from "react";

export function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [etatuser, setEtatUser] = useState(true);
  const [etatQualite, setEtatQualite] = useState(true);
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
      setEtatUser(false);
    } else {
      setEtatUser(true);
    }
    
  }, [user]);

  return { user, etatuser, setUser, setEtatUser };
}
