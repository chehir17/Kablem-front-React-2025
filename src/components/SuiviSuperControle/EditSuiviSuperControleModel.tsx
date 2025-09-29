import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import { Modal } from "../ui/modal";

interface EditSuiviSuperControleModelProps {
    isOpen: boolean;
    onClose: () => void;
    suivisupercontrole: {
        id_supercontrole: number;
        id_article: string;
        rev_projet: string;
        id_client: string;
        type_controle: string;
        doc_refirance: string;
        methode_controle: string;
        date_début: Date;
        duree_estime: number;
        tracibilite_cablage: string;
        tracibilite_carton: string;
        heurs_internedepensees: number;
        date_final: Date;
    } | null;
    onSave: (updateSuiviSupercontrole: {
        id_supercontrole: number;
        id_article: string;
        rev_projet: string;
        id_client: string;
        type_controle: string;
        doc_refirance: string;
        methode_controle: string;
        date_début: Date;
        duree_estime: number;
        tracibilite_cablage: string;
        tracibilite_carton: string;
        heurs_internedepensees: number;
        date_final: Date;
    }) => void;
}

export default function EditSuiviSuperControleModel({
    isOpen,
    onClose,
    suivisupercontrole,
    onSave
}: EditSuiviSuperControleModelProps) {

    const [formData, setFormData] = useState({
        id_supercontrole: 0,
        id_article: "",
        rev_projet: "",
        id_client: "",
        type_controle: "",
        doc_refirance: "",
        methode_controle: "",
        date_début: new Date(""),
        duree_estime: 0,
        tracibilite_cablage: "",
        tracibilite_carton: "",
        heurs_internedepensees: 0,
        date_final: new Date(""),
    });

    useEffect(() => {
        if (suivisupercontrole) {
            setFormData(suivisupercontrole);
        }
    }, [suivisupercontrole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (suivisupercontrole) {
            onSave(formData);
            console.log("Ligne mis à jour :", formData);
            onClose();
        }
    };

    const optionsClient = [
        { value: "ammar", label: "ammar" },
        { value: "mohsen", label: "mohsen" },
    ];

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

    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];



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
                                    options={optionsCodeArticle}
                                    placeholder="Sélectionner un article"
                                    onChange={(value: string) => handleSelectChange("id_article", value)}
                                    value={formData.id_article}
                                />
                            </div>
                            <div>
                                <Label htmlFor="rev_projet">Rev Projet</Label>
                                <Input
                                    type="text"
                                    id="rev_projet"
                                    name="rev_projet"
                                    onChange={handleChange}
                                    value={formData.rev_projet}
                                />
                            </div>
                            <div>
                                <Label>Client</Label>
                                <Select
                                    options={optionsClient}
                                    placeholder="Sélectionner un client"
                                    onChange={(value: string) => handleSelectChange("id_article", value)}
                                    value={formData.id_client} />
                            </div>
                            <div>
                                <Label>Type de contrôle (GP12,SLP,CSL2,Sécurisation) </Label>
                                <Select
                                    options={optionsTypeCntrole}
                                    placeholder="Sélectionner un Type de controle"
                                    onChange={(value: string) => handleSelectChange("id_article", value)}
                                    value={formData.type_controle} />
                            </div>
                            <div>
                                <Label htmlFor="doc_refirance">Doc de référence </Label>
                                <Input
                                    type="text"
                                    id="doc_refirance"
                                    name="doc_refirance"
                                    onChange={handleChange}
                                    value={formData.doc_refirance}
                                />
                            </div>
                            <div>
                                <Label>Méthode de contrôle</Label>
                                <Select
                                    options={optionsMethodeControle}
                                    placeholder="Sélectionner la méthode de contrôle"
                                    onChange={(value: string) => handleSelectChange("id_article", value)}
                                    value={formData.methode_controle} />
                            </div>
                            <div className="">
                                <DatePicker
                                    id="date_début"
                                    label="Date de début"
                                    placeholder="Select a date"
                                    defaultDate={formData.date_début}
                                    onChange={(dates,) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        console.log(selectedDate);
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="duree_estime">Durée estimé</Label>
                                <Input
                                    type="number"
                                    id="duree_estime"
                                    name="duree_estime"
                                    onChange={handleChange}
                                    value={formData.duree_estime}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tracibilite_cablage">Traçabilité sur câblage</Label>
                                <Input
                                    type="text"
                                    id="tracibilite_cablage"
                                    name="tracibilite_cablage"
                                    onChange={handleChange}
                                    value={formData.tracibilite_cablage}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tracibilite_carton">Traçabilité sur carton </Label>
                                <Input
                                    type="text"
                                    id="tracibilite_carton"
                                    name="tracibilite_carton"
                                    onChange={handleChange}
                                    value={formData.tracibilite_carton}
                                />
                            </div>
                            <div>
                                <Label htmlFor="heurs_internedepensees">Heures internes dépensées</Label>
                                <Input
                                    type="text"
                                    id="heurs_internedepensees"
                                    name="heurs_internedepensees"
                                    onChange={handleChange}
                                    value={formData.heurs_internedepensees}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="date_final"
                                    label="Date fins"
                                    placeholder="Select a date"
                                    defaultDate={formData.date_final}
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        console.log(selectedDate);
                                    }}
                                />
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