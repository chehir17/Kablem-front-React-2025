import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import { Modal } from "../ui/modal";
import { Suivisupercontrole } from "../../types/SuiviSuperControle";
import { Article } from "../../types/Articles";
import { Client } from "../../types/Client";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { validateForm } from "./validation";
import { SuiviSuperControlesService } from "../../services/SuiviSuperControle";
import { handleFileChange } from "./handleFilechange";

interface EditSuiviSuperControleModelProps {
    isOpen: boolean;
    onClose: () => void;
    suivisupercontrole: Suivisupercontrole | null;
    onSave: (updateSuiviSupercontrole: Suivisupercontrole) => void;
}

export default function EditSuiviSuperControleModel({
    isOpen,
    onClose,
    suivisupercontrole,
    onSave
}: EditSuiviSuperControleModelProps) {

    const [formData, setFormData] = useState({
        id_supercontrole: 0,
        code_artc: "",
        rev_projet: "",
        nom_client: "",
        type_controle: "",
        doc_refirance: "",
        methode_controle: "",
        date_debut: new Date(""),
        duree_estime: new Date(""),
        tracibilite_cablage: "",
        tracibilite_carton: "",
        heurs_internedepensees: 0,
        date_final: new Date(""),
    });
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});
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
        if (suivisupercontrole) {
            setFormData(suivisupercontrole);
        }
        fetchData();
    }, [suivisupercontrole]);

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
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
            formDataToSend.append("date_début", formData.date_debut.toString() ?? "");
            formDataToSend.append("durée_estimé", formData.duree_estime.toString() ?? "");
            formDataToSend.append("tracibilite_cablage", formData.tracibilite_cablage || "");
            formDataToSend.append("tracibilite_carton", formData.tracibilite_carton || "");
            formDataToSend.append("heurs_internedepensees", formData.heurs_internedepensees.toString() ?? "");
            if (formData.doc_refirance) formDataToSend.append("doc_refirance", formData.doc_refirance);;


            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            const response = await SuiviSuperControlesService.updateSuiviSuperControles(suivisupercontrole!.id_supercontrole, formDataToSend);
            onSave(response.data);
            onClose();
            console.log("Utilisateur créé :", response.data);
            swal({
                title: "Good job!",
                text: "Le suivi a été Modifié avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/suivi-super-controle";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Impossible de modifier le suivi.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-70">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {suivisupercontrole ? `Modifier Suivi Fournisseur N° ${suivisupercontrole.id_supercontrole}` : "Modifier"}
                </h4>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mr-5 mb-2">
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
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {/*Affichage du nom du fichier sélectionné */}
                                {formData.doc_refirance && (
                                    <p className="text-green-600 mt-1 text-sm">
                                        ✅ Fichier sélectionné :{" "}
                                        <b>{formData.doc_refirance}</b>
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
                                <Label htmlFor="duree_estime">Durée estimé</Label>
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
                                    type="text"
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
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}