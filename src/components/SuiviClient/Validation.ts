export const validateForm = (formData: any, setErrors: (errors: any) => void): boolean => {
        let newErrors: any = {};

        if (!formData.num_rec_cli) newErrors.num_rec_cli = "Le numéro de réclamation client est requis!";
        if (!formData.date_rec_cli) newErrors.date_rec_cli = "La date de réclamation client est requise!";
        if (!formData.zone) newErrors.zone = "La zone est requise!";
        if (!formData.nom_client) newErrors.nom_client = "Le nom est requis!";
        if (!formData.ref) newErrors.ref = "Le code article est requis!";
        if (!formData.nom_projet) newErrors.nom_projet = "Le nom du projet est requis!";
        if (!formData.phase_projet) newErrors.phase_projet = "Lz phase du projet est requise!";
        if (!formData.photo_ok) newErrors.photo_ok = "La Photo OK est requise!";
        if (!formData.photo_nok) newErrors.photo_nok = "La Photo Non Ok est requise!";
        if (!formData.nbr_piec_ko) newErrors.nbr_piec_ko = "La nombre des piéce Ko est requise!";
        if (!formData.type_incidant) newErrors.type_incidant = "Le type des incidant est requis!";
        if (!formData.id_suivifournisseur) newErrors.id_suivifournisseur = "Le numéro de réclamation fournissuer est requis!";
        if (!formData.recurence) newErrors.recurence = "La recurence est requise!";
        if (!formData.statut) newErrors.statut = "La statut est requise!";
        if (!formData.cout_non_quat_s_rec) newErrors.cout_non_quat_s_rec = "Le CNQ est requis!";
        if (!formData.desc_deff) newErrors.desc_deff = "Le description de defaut est requis!";



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
