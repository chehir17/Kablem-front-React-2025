import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";


export default function AddFIchDMPPForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const optionsLigne = [
        { value: "Ligne1", label: "Ligne 01" },
        { value: "ligne2", label: "Ligne 02" },
    ];

    const optionsClients = [
        { value: "mostfa", label: "Mostafa" },
        { value: "hamadi", label: "Hamadi" },
    ];

    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];

    const optionsEtat = [
        { value: "en_cours", label: "en cours" },
        { value: "termine", label: "terminé" },
        { value: "planifie", label: "planifié" },
        { value: "bloque", label: "bloqué" },
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
            <ComponentCard title="Ajouter une Fiche DMPP">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Ligne</Label>
                        <Select
                            options={optionsLigne}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="post">Post</Label>
                        <Input
                            type="text"
                            id="post"
                            name="post"
                        />
                    </div>
                    <div>
                        <Label>Code Article</Label>
                        <Select
                            options={optionsCodeArticle}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="nature">Nature</Label>
                        <Input
                            type="text"
                            id="nature"
                            name="nature"
                        />
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Input
                            type="text"
                            id="zone"
                            name="zone"
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="mois"
                            label="Date souhaité"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                // Récupère la première date sélectionnée (si c'est un tableau)
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                console.log(selectedDate);
                            }}
                        />
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Input
                            type="text"
                            id="type"
                            name="type"
                        />
                    </div>
                    <div>
                        <Label>Nom Client</Label>
                        <Select
                            options={optionsClients}
                            placeholder="Sélectionner un nom"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Cout estimative</Label>
                        <Input
                            type="number"
                            id="cout_estimative"
                            name="cout_estimative"
                        />
                    </div>
                    <div>
                        <Label>état actuel </Label>
                        <Select
                            options={optionsEtat}
                            placeholder="Sélectionner une etat"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Etat de modification</Label>
                        <Input
                            type="text"
                            id="etat_modif"
                            name="etat_modif"
                        />
                    </div>
                    <div className="mb-5">
                        <Label>Objectif de modification</Label>
                        <Input
                            type="text"
                            id="objectif_modif"
                            name="objectif_modif"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter un utilisateur`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter Fiche DMPP
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}