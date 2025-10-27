import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";
import { FicheDMPP } from "../../types/FichDMPP";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { LigneService } from "../../services/LigneService";
import { Ligne } from "../../types/Ligne";
import { Article } from "../../types/Articles";
import { Client } from "../../types/Client";
import { FichDMPPService } from "../../services/FichDMPP";

interface EditFichDMPPModalProps {
    isOpen: boolean;
    onClose: () => void;
    fichdmpps: FicheDMPP | null;
    onSave: (updatedFichdmpp: FicheDMPP) => void;
}

export default function EditFIchDMPPModal({
    isOpen,
    onClose,
    fichdmpps,
    onSave,
}: EditFichDMPPModalProps) {
    const [formData, setFormData] = useState({
        id_dmpp: 0,
        nom_ligne: "",
        post: "",
        code_artc: "",
        nature: "",
        zone: "",
        date_sou: new Date(),
        type: "",
        nom_client: "",
        cout_estimative: "",
        etat_actu: "",
        etat_modif: "",
        objectif_modif: "",
    });
    const [Lignes, setLignes] = useState<Ligne[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});

    const fetchData = async () => {
        try {
            const [dataArticles, dataClients, dataLignes] = await Promise.all([
                ArticleService.getArticles(),
                ClientService.getClient(),
                LigneService.getLigne(),
            ]);
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
            if (Array.isArray(dataClients)) setClients(dataClients);
            if (Array.isArray(dataLignes)) setLignes(dataLignes);
        } catch (err) {
            console.error(err);
            console.log("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (fichdmpps) {
            setFormData(fichdmpps);
        }
    }, [fichdmpps]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.nom_ligne) newErrors.nom_ligne = "Le nom de ligne est requis";
        if (!formData.post) newErrors.post = "Le post est requis";
        if (!formData.code_artc) newErrors.code_artc = "Le code de l'article est requis";
        if (!formData.nature) newErrors.nature = "Le nature est requis";
        if (!formData.zone) newErrors.zone = "La zone est requis";
        if (!formData.type) newErrors.type = "Le type est requis";
        if (!formData.date_sou) newErrors.date_sou = "La Date souhaité  est requise";
        if (!formData.nom_client) newErrors.nom_client = "Le nom de client est requis";
        if (!formData.cout_estimative) newErrors.cout_estimative = "La cout estimative est requise";
        if (!formData.etat_actu) newErrors.etat_actu = "L'etat actuel est requise";
        if (!formData.etat_modif) newErrors.etat_modif = "L'etat modification est requise";
        if (!formData.objectif_modif) newErrors.objectif_modif = "L'objectif de modification est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const optionsEtat = [
        { value: "en_cours", label: "en cours" },
        { value: "termine", label: "terminé" },
        { value: "planifie", label: "planifié" },
        { value: "bloque", label: "bloqué" },
    ];

    const zone = [
        { value: "P1", label: "P1" },
        { value: "P2", label: "P2" },
        { value: "P3", label: "P3" },
        { value: "P1 + P2", label: "P1 + P2" },
        { value: "P1 + P2 + P3", label: "P1 + P2 + P3" },
        { value: "CET", label: "CET" },
        { value: "Magasin", label: "Magasin" },
        { value: "P3-1", label: "P3-1" },
        { value: "P3-2", label: "P3-2" },
        { value: "P3-3", label: "P3-3" },
        { value: "Usine", label: "Usine" },
    ];

    const nature = [
        { value: "interne", label: "interne" },
        { value: "externe", label: "externe" },
    ]

    const handleSubmit = async () => {
        console.log(formData)
        try {
            setLoading(true);
            const updated = await FichDMPPService.updateDMPP(formData.id_dmpp, formData);
            console.log(" fiche dmppp mis à jour :", updated);
            onSave(updated);
            onClose();
            swal({
                title: "succès !",
                text: "La fiche Dmpp  est à jour !",
                icon: "success",
            })

            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de fiche dmpp !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Fich DMPP N°{formData.id_dmpp}
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label>Ligne</Label>
                                <Select
                                    options={Lignes.length > 0
                                        ? Lignes.map(dep => ({ value: String(dep.id_ligne), label: dep.nom_ligne }))
                                        : [{ value: "", label: "Aucun Lignes disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "nom_ligne")}
                                    value={formData.nom_ligne}
                                />
                                {errors.nom_ligne && <p className="text-red-500 text-sm">{errors.nom_ligne}</p>}
                            </div>

                            <div>
                                <Label htmlFor="post">Post</Label>
                                <Input
                                    type="text"
                                    id="post"
                                    name="post"
                                    value={formData.post}
                                    onChange={handleChange}
                                    error={!!errors.post}
                                    success={!!formData.post}
                                />
                                {errors.post && <p className="text-red-500 text-sm">{errors.post}</p>}
                            </div>
                            <div>
                                <Label>Code Article</Label>
                                <Select
                                    options={Articles.length > 0
                                        ? Articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                        : [{ value: "", label: "Aucun articles disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "code_artc")}
                                    value={formData.code_artc}
                                />
                                {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                            </div>
                            <div>
                                <Label htmlFor="nature">Nature</Label>
                                <Select
                                    options={nature}
                                    placeholder="Sélectionner une nature"
                                    value={formData.nature}
                                    onChange={(val) => handleSelectChange(val, "nature")}
                                    className="w-full"
                                />
                                {errors.nature && <p className="text-red-500 text-sm">{errors.nature}</p>}
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Select
                                    options={zone}
                                    placeholder="Sélectionner une zone"
                                    value={formData.zone}
                                    onChange={(val) => handleSelectChange(val, "zone")}
                                    className="w-full"
                                />
                                {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                            </div>
                            <div className="">
                                <DatePicker
                                    id="mois"
                                    label="Date souhaité"
                                    placeholder="Select a date"
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData({
                                            ...formData,
                                            date_sou: selectedDate || new Date(),
                                        });
                                    }}
                                />
                                {errors.date_sou && <p className="text-red-500 text-sm">{errors.date_sou}</p>}
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    error={!!errors.type}
                                    success={!!formData.type}
                                />
                                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                            </div>
                            <div>
                                <Label>Nom Client</Label>
                                <Select
                                    options={Clients.length > 0
                                        ? Clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                        : [{ value: "", label: "Aucun clients disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "nom_client")}
                                    value={formData.nom_client}
                                />
                                {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}
                            </div>
                            <div>
                                <Label>Cout estimative</Label>
                                <Input
                                    type="number"
                                    id="cout_estimative"
                                    name="cout_estimative"
                                    value={formData.cout_estimative}
                                    error={!!errors.cout_estimative}
                                    success={!!formData.cout_estimative}
                                    onChange={handleChange}
                                />
                                {errors.cout_estimative && <p className="text-red-500 text-sm">{errors.cout_estimative}</p>}
                            </div>
                            <div>
                                <Label>état actuel </Label>
                                <Select
                                    options={optionsEtat}
                                    placeholder="Sélectionner une etat"
                                    onChange={(val) => handleSelectChange(val, "etat_actu")}
                                    value={formData.etat_actu}
                                />
                                {errors.etat_actu && <p className="text-red-500 text-sm">{errors.etat_actu}</p>}
                            </div>
                            <div>
                                <Label>Etat de modification</Label>
                                <Input
                                    type="text"
                                    id="etat_modif"
                                    name="etat_modif"
                                    value={formData.etat_modif}
                                    onChange={handleChange}
                                    error={!!errors.etat_modif}
                                    success={!!formData.etat_modif}
                                />
                                {errors.etat_modif && <p className="text-red-500 text-sm">{errors.etat_modif}</p>}
                            </div>
                            <div className="mb-5">
                                <Label>Objectif de modification</Label>
                                <Input
                                    type="text"
                                    id="objectif_modif"
                                    name="objectif_modif"
                                    value={formData.objectif_modif}
                                    onChange={handleChange}
                                    error={!!errors.objectif_modif}
                                    success={!!formData.objectif_modif}
                                />
                                {errors.objectif_modif && <p className="text-red-500 text-sm">{errors.objectif_modif}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-0 lg:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Enregistrement...⏳" : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}