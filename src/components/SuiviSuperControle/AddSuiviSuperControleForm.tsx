import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";


export default function AddSuiviSuperControleForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
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
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
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
                            options={optionsCodeArticle}
                            placeholder="Sélectionner un article"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rev_projet">Rev Projet</Label>
                        <Input
                            type="text"
                            id="rev_projet"
                            name="rev_projet"
                        />
                    </div>
                    <div>
                        <Label>Client</Label>
                        <Select
                            options={optionsClient}
                            placeholder="Sélectionner un client"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Type de contrôle (GP12,SLP,CSL2,Sécurisation) </Label>
                        <Select
                            options={optionsTypeCntrole}
                            placeholder="Sélectionner un Type de controle"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="doc_refirance">Doc de référence </Label>
                        <Input
                            type="text"
                            id="doc_refirance"
                            name="doc_refirance"
                        />
                    </div>
                    <div>
                        <Label>Méthode de contrôle</Label>
                        <Select
                            options={optionsMethodeControle}
                            placeholder="Sélectionner la méthode de contrôle"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_début"
                            label="Date de début"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                // Récupère la première date sélectionnée (si c'est un tableau)
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
                        />
                    </div>
                    <div>
                        <Label htmlFor="tracibilite_cablage">Traçabilité sur câblage</Label>
                        <Input
                            type="text"
                            id="tracibilite_cablage"
                            name="tracibilite_cablage"
                        />
                    </div>
                    <div>
                        <Label htmlFor="tracibilite_carton">Traçabilité sur carton </Label>
                        <Input
                            type="text"
                            id="tracibilite_carton"
                            name="tracibilite_carton"
                        />
                    </div>
                    <div>
                        <Label htmlFor="heurs_internedepensees">Heures internes dépensées</Label>
                        <Input
                            type="text"
                            id="heurs_internedepensees"
                            name="heurs_internedepensees"
                        />
                    </div>
                    <div>
                        <DatePicker
                            id="date_final"
                            label="Date fins"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                // Récupère la première date sélectionnée (si c'est un tableau)
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                console.log(selectedDate);
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter Suivi Super Controle`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter Suivi Super Controle
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}