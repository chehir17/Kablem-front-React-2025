export const validateForm = (formData: any, setErrors: (errors: any) => void): boolean => {
        let newErrors: any = {};


        if (!formData.code_artc) newErrors.code_artc = "Le code article est requis";
        if (!formData.rev_projet) newErrors.rev_projet = "Le rev projet est requis";
        if (!formData.nom_client) newErrors.nom_client = "Le nom de client est requis";
        if (!formData.type_controle) newErrors.type_controle = "Le type de controle est requis";
        if (!formData.doc_refirance) newErrors.doc_refirance = "La document de référence est requis";
        if (!formData.methode_controle) newErrors.methode_controle = "La methode de controle est requis";
        if (!formData.date_debut) newErrors.date_debut = "La Date début  est requise";
        if (!formData.duree_estime) newErrors.duree_estime = "Le durée estimé est requis";
        if (!formData.tracibilite_cablage) newErrors.tracibilite_cablage = "La traçabilité de cablage est requise";
        if (!formData.tracibilite_carton) newErrors.tracibilite_carton = "La traçabilité du carton est requise";
        if (!formData.heurs_internedepensees) newErrors.heurs_internedepensees = "Les heures interne dépenses est requise";
        if (!formData.date_final) newErrors.date_final = "La date finale est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    