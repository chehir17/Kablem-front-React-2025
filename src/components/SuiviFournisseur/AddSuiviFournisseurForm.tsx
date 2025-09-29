import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import FileInput from "../form/input/FileInput";


export default function AddSuiviFournisseurForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
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
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Suivi Defaut Fournisseur">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-4">
                    <div>
                        <Label>Code Article</Label>
                        <Select
                            options={optionsCodeArticle}
                            placeholder="Sélectionner un article"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Fournisseur</Label>
                        <Select
                            options={optionsFournisseur}
                            placeholder="Sélectionner un Fournisseur"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Classification</Label>
                        <Select
                            options={optionsClassification}
                            placeholder="Sélectionner la classification"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="desc_prob">Description de problème</Label>
                        <Input
                            type="text"
                            id="desc_prob"
                            name="desc_prob"
                        />
                    </div>
                    <div>
                        <Label htmlFor="pcs_ko_detecte">Pcs KO détectées </Label>
                        <Input
                            type="number"
                            id="pcs_ko_detecte"
                            name="pcs_ko_detecte"
                        />
                    </div>
                    <div>
                        <Label>TRIAGE (Oui/Non) </Label>
                        <Select
                            options={optionsOUINON}
                            placeholder="Sélectionner Triage"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="tot_pcs_ko"> Total des pcs KO </Label>
                        <Input
                            type="number"
                            id="tot_pcs_ko"
                            name="tot_pcs_ko"
                        />
                    </div>
                    <div>
                        <Label>Décision</Label>
                        <Select
                            options={optionsDecision}
                            placeholder="Sélectionner le Décision"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Dérogation (Oui/Non)</Label>
                        <Select
                            options={optionsOUINON}
                            placeholder="Sélectionner Dérogation"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cout_tret">Coût De traitement </Label>
                        <Input
                            type="number"
                            id="cout_tret"
                            name="cout_tret"
                        />
                    </div>
                    <div>
                        <Label>Statut </Label>
                        <Select
                            options={optionsStatut}
                            placeholder="Sélectionner une statut"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="notes">notes</Label>
                        <Input
                            type="text"
                            id="notes"
                            name="notes"
                        />
                    </div>
                    <div>
                        <Label>Piéces jointe </Label>
                        <FileInput onChange={handleFileChange} className="w-full" />
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter Suivi Defaut fournisseur`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter Suivi Defaut Fournisseur
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}