export const validateForm = (formData: any, setErrors: (errors: any) => void): boolean => {
        let newErrors: any = {};

        if (!formData.code_artc) newErrors.code_artc = "Le nom de l'article est requis";
        if (!formData.num_lot_date) newErrors.num_lot_date = "Le Lot est requis";
        if (!formData.sujet_non_conformite) newErrors.sujet_non_conformite = "Le sujet est requis";
        if (!formData.photo_ok) newErrors.photo_ok = "La Photo OK est requise";
        if (!formData.photo_nok) newErrors.photo_nok = "La Photo Non Ok est requise";
        if (!formData.photo_idant) newErrors.photo_idant = "La Photo Identité est requise";
        if (!formData.qte_nc) newErrors.qte_nc = "Le Quantité NC est requis";
        if (!formData.process) newErrors.process = "Le process est requis";
        if (!formData.nom_client) newErrors.nom_client = "Le nom de client est requis";
        if (!formData.occurance_defaut) newErrors.occurance_defaut = "L'occurence defaut est requise";
        if (!formData.ac_immed) newErrors.ac_immed = "L'action immediate est requise";
        if (!formData.date_ac_immed) newErrors.date_ac_immed = "La date de l'action immediate est requise";
        if (!formData.date_verf_ac_immed) newErrors.date_verf_ac_immed = "La date de verification est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
