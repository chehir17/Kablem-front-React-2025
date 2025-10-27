import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import { Client } from "../../types/Client";
import { Article } from "../../types/Articles";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { validateForm } from "./validation";
import { SuiviSuperControlesService } from "../../services/SuiviSuperControle";
import { FileInput } from "lucide-react";
import { handleFileChange } from "./handleFilechange";


export default function AddSuiviSuperControleForm() {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [dataArticles, dataClients] = await Promise.all([
                ArticleService.getArticles(),
                ClientService.getClient(),
            ]);
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
            if (Array.isArray(dataClients)) setClients(dataClients);
        } catch (err) {
            console.error(err);
            console.log("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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



    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const isValid = validateForm(formData, setErrors);
        if (!isValid) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("code_artc", formData.code_artc || "");
            formDataToSend.append("rev_projet", formData.rev_projet || "");
            formDataToSend.append("nom_client", formData.nom_client || "");
            formDataToSend.append("type_controle", formData.type_controle || "");
            formDataToSend.append("methode_controle", formData.methode_controle || "");
            formDataToSend.append("date_debut", formData.date_debut || "");
            formDataToSend.append("duree_estime", formData.duree_estime || "");
            formDataToSend.append("tracibilite_cablage", formData.tracibilite_cablage || "");
            formDataToSend.append("tracibilite_carton", formData.tracibilite_carton || "");
            formDataToSend.append("heurs_internedepensees", formData.heurs_internedepensees || "");
            formDataToSend.append("date_final", formData.date_final || "");
            if (formData.doc_refirance) formDataToSend.append("doc_refirance", formData.doc_refirance);


            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
            
            const response = await SuiviSuperControlesService.createSuiviSuperControles(formDataToSend);

            console.log("Utilisateur créé :", response.data);
            swal({
                title: "Good job!",
                text: "Le suivi Super controle a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/suivi-super-controle/";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Impossible d'ajouter le suivi .",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    const optionsTypeCntrole = [
        { value: "contrôle Final", label: "contrôle Final" },
        { value: "GP12", label: "GP12" },
        { value: "CSL2", label: "CSL2" },
        { value: "CSL2/SLP", label: "CSL2/SLP" },
        { value: "Sécurisation", label: "GPSécurisation12" },
        { value: "SLP", label: "SLP" },
    ];

    const optionsMethodeControle = [
        { value: "Visuellement/Manuel", label: "Visuellement/Manuel" },
        { value: "Visuellement", label: "Visuellement" },
        { value: "Manuel", label: "Manuel" },
    ];


    return (
        <div>
            <PageMeta
                title="Ajouter Suivi Super Controle"
                description="interface qui permet de ajouter un suivi super controle"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Suivi Super Controle">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-4">
                    <div>
                        <Label>Code Article</Label>
                        <Select
                            options={Articles.length > 0
                                ? Articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                : [{ value: "", label: "Aucun articel disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "code_artc")}
                        />
                        {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                    </div>
                    <div>
                        <Label htmlFor="rev_projet">Rev Projet</Label>
                        <Input
                            type="text"
                            id="rev_projet"
                            name="rev_projet"
                            error={!!errors.rev_projet}
                            success={!!formData.rev_projet}
                            onChange={handleChange}
                        />
                        {errors.rev_projet && <p className="text-red-500 text-sm">{errors.rev_projet}</p>}
                    </div>
                    <div>
                        <Label>Client</Label>
                        <Select
                            options={Clients.length > 0
                                ? Clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                : [{ value: "", label: "Aucun client disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "nom_client")}
                        />
                        {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}

                    </div>
                    <div>
                        <Label>Type de contrôle (GP12,SLP,CSL2,Sécurisation) </Label>
                        <Select
                            options={optionsTypeCntrole}
                            placeholder="Sélectionner un Type de controle"
                            onChange={(val) => handleSelectChange(val, "type_controle")}
                        />
                        {errors.type_controle && <p className="text-red-500 text-sm">{errors.type_controle}</p>}

                    </div>
                    {/* Doc de référence */}
                    <div>
                        <Label htmlFor="doc_refirance">Doc de référence</Label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.csv"
                            onChange={(e) => handleFileChange(e, "doc_refirance", setFormData, setErrors)}
                            className="w-full border border-gray-300 rounded-md p-2 dark:text-white/70"
                        />
                        {/*Affichage du nom du fichier sélectionné */}
                        {formData.doc_refirance && (
                            <p className="text-green-600 mt-1 text-sm">
                                ✅ Fichier sélectionné :{" "}
                                <b>{formData.doc_refirance.name}</b>
                            </p>
                        )}
                        {/* Affichage de l’erreur */}
                        {errors.doc_refirance && (
                            <p className="text-red-500 text-sm">{errors.doc_refirance}</p>
                        )}
                    </div>
                    <div>
                        <Label>Méthode de contrôle</Label>
                        <Select
                            options={optionsMethodeControle}
                            placeholder="Sélectionner la méthode de contrôle"
                            onChange={(val) => handleSelectChange(val, "methode_controle")}
                        />
                        {errors.methode_controle && <p className="text-red-500 text-sm">{errors.methode_controle}</p>}
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_debut"
                            label="Date Début "
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    date_debut: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
                            }}
                        />
                        {errors.date_debut && <p className="text-red-500 text-sm">{errors.date_debut}</p>}

                    </div>
                    <div>
                        <DatePicker
                            id="duree_estime"
                            label="durée estimée "
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    duree_estime: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
                            }}
                        />
                        {errors.duree_estime && <p className="text-red-500 text-sm">{errors.duree_estime}</p>}

                    </div>
                    <div>
                        <Label htmlFor="tracibilite_cablage">Traçabilité sur câblage</Label>
                        <Input
                            type="text"
                            id="tracibilite_cablage"
                            name="tracibilite_cablage"
                            error={!!errors.tracibilite_cablage}
                            success={!!formData.tracibilite_cablage}
                            onChange={handleChange}
                        />
                        {errors.tracibilite_cablage && <p className="text-red-500 text-sm">{errors.tracibilite_cablage}</p>}

                    </div>
                    <div>
                        <Label htmlFor="tracibilite_carton">Traçabilité sur carton </Label>
                        <Input
                            type="text"
                            id="tracibilite_carton"
                            name="tracibilite_carton"
                            error={!!errors.tracibilite_carton}
                            success={!!formData.tracibilite_carton}
                            onChange={handleChange}
                        />
                        {errors.tracibilite_carton && <p className="text-red-500 text-sm">{errors.tracibilite_carton}</p>}

                    </div>
                    <div>
                        <Label htmlFor="heurs_internedepensees">Heures internes dépensées</Label>
                        <Input
                            type="number"
                            id="heurs_internedepensees"
                            name="heurs_internedepensees"
                            error={!!errors.heurs_internedepensees}
                            success={!!formData.heurs_internedepensees}
                            onChange={handleChange}
                        />
                        {errors.heurs_internedepensees && <p className="text-red-500 text-sm">{errors.heurs_internedepensees}</p>}

                    </div>
                    <div>
                        <DatePicker
                            id="date_final"
                            label="Date finale "
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    date_final: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
                            }}
                        />
                        {errors.date_final && <p className="text-red-500 text-sm">{errors.date_final}</p>}

                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
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