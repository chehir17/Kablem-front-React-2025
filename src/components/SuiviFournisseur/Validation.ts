export const validateForm = (formData: any, setErrors: (errors: any) => void): boolean => {
        let newErrors: any = {};


        if (!formData.code_artc) newErrors.code_artc = "Le code article est requis";
        if (!formData.nom_fournisseur) newErrors.nom_fournisseur = "Le nom de fournisseur est requis";
        if (!formData.class) newErrors.class = "La classification est requise";
        if (!formData.desc_prob) newErrors.desc_prob = "La description de probléme est requis";
        if (!formData.pcs_ko_detecte) newErrors.pcs_ko_detecte = "La piéce ko detecter est requise";
        if (!formData.triage) newErrors.triage = "Le triage est requis";
        if (!formData.tot_pcs_ko) newErrors.tot_pcs_ko = "Le totale des piéces ko est requis";
        if (!formData.decision) newErrors.decision = "Le descision est requis";
        if (!formData.derogation) newErrors.derogation = "La derogation est requise";
        if (!formData.cout_tret) newErrors.cout_tret = "Le cout de traitement est requis";
        if (!formData.statut) newErrors.statut = "Le statut de traitement est requis";
        if (!formData.notes) newErrors.notes = "La note est requis";
        if (!formData.piece_joint) newErrors.piece_joint = "La piéce joint est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    