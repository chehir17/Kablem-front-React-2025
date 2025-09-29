import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import FileInput from "../form/input/FileInput";
import { Modal } from "../ui/modal";


interface EditSuiviClientModelProps {
    isOpen: boolean;
    onClose: () => void;
    suivifournisseur: {
        id_suivifournisseur: number;
        created_at: Date;
        id_article: string;
        id_fournisseur: string;
        classification: string;
        desc_prob: string;
        pcs_ko_detecte: number;
        triage: string;
        tot_pcs_ko: number;
        decision: string;
        derogation: string;
        cout_tret: number;
        statut: string;
        notes: string;
        piece_joint: string;
    } | null;
    onSave: (updatesuiviFournisseur: {
        id_suivifournisseur: number;
        created_at: Date;
        id_article: string;
        id_fournisseur: string;
        classification: string;
        desc_prob: string;
        pcs_ko_detecte: number;
        triage: string;
        tot_pcs_ko: number;
        decision: string;
        derogation: string;
        cout_tret: number;
        statut: string;
        notes: string;
        piece_joint: string;
    }) => void;
}

export default function EditSuiviFournsisseurModel({
    isOpen,
    onClose,
    suivifournisseur,
    onSave
}: EditSuiviClientModelProps) {

    const [formData, setFormData] = useState({
        id_suivifournisseur: 0,
        created_at: new Date(""),
        id_article: "",
        id_fournisseur: "",
        classification: "",
        desc_prob: "",
        pcs_ko_detecte: 0,
        triage: "",
        tot_pcs_ko: 0,
        decision: "",
        derogation: "",
        cout_tret: 0,
        statut: "",
        notes: "",
        piece_joint: "",
    });

    useEffect(() => {
        if (suivifournisseur) {
            setFormData(suivifournisseur);
        }
    }, [suivifournisseur]);

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
        if (suivifournisseur) {
            onSave(formData);
            console.log("Ligne mis à jour :", formData);
            onClose();
        }
    };


    const optionsClassification = [
        { value: "C1", label: "C1" },
        { value: "C2", label: "C2" },
        { value: "C3", label: "C3" },

    ];

    const optionsOUINON = [
        { value: "Oui", label: "Oui" },
        { value: "Non", label: "Non" },
    ];


    const optionsFournisseur = [
        { value: "ammar", label: "ammar" },
        { value: "mohsen", label: "mohsen" },
    ];

    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];

    const optionsDecision = [
        { value: "Retour Production", label: "Retour Production" },
        { value: "Reworker", label: "Reworker" },
        { value: "Retour Fournisseur", label: "Retour Fournisseur" },
        { value: "Mise au Rebut", label: "Mise au Rebut" },
    ];

    const optionsStatut = [
        { value: "Ouvert", label: "Ouvert" },
        { value: "En cours", label: "En cours" },
        { value: "Clôturé", label: "Clôturé" },
        { value: "Annulé", label: "Annulé" },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };



    return (


        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-70">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {suivifournisseur ? `Modifier Suivi Fournisseur N° ${suivifournisseur.id_suivifournisseur}` : "Modifier"}
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
                                <Label>Fournisseur</Label>
                                <Select
                                    options={optionsFournisseur}
                                    placeholder="Sélectionner un Fournisseur"
                                    onChange={(value: string) => handleSelectChange("id_fournisseur", value)}
                                    value={formData.id_fournisseur}
                                />
                            </div>
                            <div>
                                <Label>Classification</Label>
                                <Select
                                    options={optionsClassification}
                                    placeholder="Sélectionner la classification"
                                    onChange={(value: string) => handleSelectChange("classification", value)}
                                    value={formData.classification}
                                />
                            </div>
                            <div>
                                <Label htmlFor="desc_prob">Description de problème</Label>
                                <Input
                                    type="text"
                                    id="desc_prob"
                                    name="desc_prob"
                                    value={formData.desc_prob}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pcs_ko_detecte">Pcs KO détectées </Label>
                                <Input
                                    type="number"
                                    id="pcs_ko_detecte"
                                    name="pcs_ko_detecte"
                                    value={formData.pcs_ko_detecte}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>TRIAGE (Oui/Non) </Label>
                                <Select
                                    options={optionsOUINON}
                                    placeholder="Sélectionner Triage"
                                    onChange={(value: string) => handleSelectChange("triage", value)}
                                    value={formData.triage}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tot_pcs_ko"> Total des pcs KO </Label>
                                <Input
                                    type="number"
                                    id="tot_pcs_ko"
                                    name="tot_pcs_ko"
                                    value={formData.tot_pcs_ko}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Décision</Label>
                                <Select
                                    options={optionsDecision}
                                    placeholder="Sélectionner le Décision"
                                    onChange={(value: string) => handleSelectChange("decision", value)}
                                    value={formData.decision}
                                />
                            </div>
                            <div>
                                <Label>Dérogation (Oui/Non)</Label>
                                <Select
                                    options={optionsOUINON}
                                    placeholder="Sélectionner Dérogation"
                                    onChange={(value: string) => handleSelectChange("derogation", value)}
                                    value={formData.derogation}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cout_tret">Coût De traitement </Label>
                                <Input
                                    type="number"
                                    id="cout_tret"
                                    name="cout_tret"
                                    value={formData.cout_tret}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Statut </Label>
                                <Select
                                    options={optionsStatut}
                                    placeholder="Sélectionner une statut"
                                    onChange={(value: string) => handleSelectChange("statut", value)}
                                    value={formData.statut}
                                />
                            </div>
                            <div>
                                <Label htmlFor="notes">notes</Label>
                                <Input
                                    type="text"
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Piéces jointe </Label>
                                <FileInput onChange={handleFileChange} className="w-full" />
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