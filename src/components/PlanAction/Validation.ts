export const validateForm = (formData: any, setErrors: (errors: any) => void): boolean => {
        let newErrors: any = {};


        if (!formData.nom_departement) newErrors.nom_departement = "Le nom department est requis";
        if (!formData.zone) newErrors.zone = "La zone est requise";
        if (!formData.origine) newErrors.origine = "L'origine est requis";
        if (!formData.prob) newErrors.prob = "La probléme est requise";
        if (!formData.cause) newErrors.cause = "Le cause est requis";
        if (!formData.action) newErrors.action = "L'action est requis";
        if (!formData.date_debut) newErrors.date_debut = "La date de début est requise";
        if (!formData.date_cloture) newErrors.date_cloture = "La date de cloture est requise";
        if (!formData.note) newErrors.note = "La note est requise";
        if (!formData.responsable) newErrors.responsable = "Le responsable est requis";
        if (!formData.support) newErrors.support = "Le support est requis";
        if (!formData.contol_effic) newErrors.contol_effic = "Le contole d'efficacité est requis";
        if (!formData.annul) newErrors.annul = "L'annulation est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    