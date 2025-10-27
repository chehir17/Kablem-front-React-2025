import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import { Ligne } from "../../types/Ligne";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { LigneService } from "../../services/LigneService";
import { Client } from "../../types/Client";
import { Article } from "../../types/Articles";
import { FichDMPPService } from "../../services/FichDMPP";


export default function AddFIchDMPPForm() {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [Lignes, setLignes] = useState<Ligne[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

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
        { value: "en cours", label: "en cours" },
        { value: "terminé", label: "terminé" },
        { value: "planifié", label: "planifié" },
        { value: "bloqué", label: "bloqué" },
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
    ];


    const handleFicheDmpp = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log("📤 Données envoyées :", formData);

            const res = await FichDMPPService.createDMPP(formData);

            swal({
                title: "Succès !",
                text: "La fiche Dmpp été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/fich-dmpp";
            });
        } catch (err) {
            console.error("Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter une Fiche DMPP">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Ligne</Label>
                        <Select
                            options={Lignes.length > 0
                                ? Lignes.map(dep => ({ value: String(dep.id_ligne), label: dep.nom_ligne }))
                                : [{ value: "", label: "Aucun Lignes disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "nom_ligne")}
                        />
                        {errors.nom_ligne && <p className="text-red-500 text-sm">{errors.nom_ligne}</p>}
                    </div>
                    <div>
                        <Label htmlFor="post">Post</Label>
                        <Input
                            type="text"
                            id="post"
                            name="post"
                            error={!!errors.post}
                            success={!!formData.post}
                            onChange={handleChange}
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
                        />
                        {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                    </div>
                    <div>
                        <Label htmlFor="nature">Nature</Label>
                        <Select
                            options={nature}
                            placeholder="Sélectionner une nature"
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
                            onChange={(val) => handleSelectChange(val, "zone")}
                            className="w-full"
                        />
                        {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_sou"
                            label="Date souhaité "
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    date_sou: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
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
                            error={!!errors.type}
                            success={!!formData.type}
                            onChange={handleChange}
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
                        />
                        {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}
                    </div>
                    <div>
                        <Label>Cout estimative</Label>
                        <Input
                            type="number"
                            id="cout_estimative"
                            name="cout_estimative"
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
                        />
                        {errors.etat_actu && <p className="text-red-500 text-sm">{errors.etat_actu}</p>}
                    </div>
                    <div>
                        <Label>Etat de modification</Label>
                        <Input
                            type="text"
                            id="etat_modif"
                            name="etat_modif"
                            error={!!errors.etat_modif}
                            success={!!formData.etat_modif}
                            onChange={handleChange}
                        />
                        {errors.etat_modif && <p className="text-red-500 text-sm">{errors.etat_modif}</p>}
                    </div>
                    <div className="mb-5">
                        <Label>Objectif de modification</Label>
                        <Input
                            type="text"
                            id="objectif_modif"
                            name="objectif_modif"
                            error={!!errors.objectif_modif}
                            success={!!formData.objectif_modif}
                            onChange={handleChange}
                        />
                        {errors.objectif_modif && <p className="text-red-500 text-sm">{errors.objectif_modif}</p>}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        type="button"
                        onClick={handleFicheDmpp}
                        className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}