import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";


export default function AddPlanActionForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const optionsAnnulation = [
        { value: "oui", label: "Oui" },
        { value: "non", label: "Non" },
    ];

    const optionsClients = [
        { value: "mostfa", label: "Mostafa" },
        { value: "hamadi", label: "Hamadi" },
    ];

    const departementOptions = [
        { value: "qualité", label: "Qualité" },
        { value: "dep_extrusion", label: "Département extrusion" },
        { value: "dep_cablage", label: "Département câblage" },
        { value: "dep_assemblage", label: "Département assemblage" },
    ]

    const optionsStatut = [
        { value: "open", label: "Open" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
        { value: "canceld", label: "Canceld" },
    ];

    const optionsLevel = [
        { value: "High_level", label: "High Level" },
        { value: "medium_level", label: "Medium Level" },
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
            <ComponentCard title="Ajouter un Plan d'action">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>statut</Label>
                        <Select
                            options={optionsStatut}
                            placeholder="Sélectionner une statut"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Departement</Label>
                        <Select
                            options={departementOptions}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
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
                    <div>
                        <Label htmlFor="origine">Origine</Label>
                        <Input
                            type="text"
                            id="origine"
                            name="origine"
                        />
                    </div>
                    <div>
                        <Label htmlFor="prob">Problémes</Label>
                        <Input
                            type="text"
                            id="prob"
                            name="prob"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cause">Cause</Label>
                        <Input
                            type="text"
                            id="cause"
                            name="cause"
                        />
                    </div>
                    <div>
                        <Label htmlFor="action">Actions</Label>
                        <Input
                            type="text"
                            id="action"
                            name="action"
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_debut"
                            label="Date de début"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                // Récupère la première date sélectionnée (si c'est un tableau)
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                console.log(selectedDate);
                            }}
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_cloture"
                            label="Date de clôture"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                // Récupère la première date sélectionnée (si c'est un tableau)
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                console.log(selectedDate);
                            }}
                        />
                    </div>
                    <div>
                        <Label>Responsable</Label>
                        <Select
                            options={optionsClients}
                            placeholder="Sélectionner un nom"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="support">Support</Label>
                        <Input
                            type="text"
                            id="support"
                            name="support"
                        />
                    </div>
                    <div>
                        <Label>Controle d'efficacité</Label>
                        <Input
                            type="text"
                            id="contol_effic"
                            name="contol_effic"
                        />
                    </div>
                    <div className="mb-5">
                        <Label>Note(date de retardement ou docs Utilisés pour controle Efficacité )</Label>
                        <Input
                            type="text"
                            id="note"
                            name="note"
                        />
                    </div>
                    <div>
                        <Label>Annulation</Label>
                        <Select
                            options={optionsAnnulation}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Level</Label>
                        <Select
                            options={optionsLevel}
                            placeholder="Sélectionner un Ligne"
                            onChange={handleSelectChange}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter un utilisateur`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter plan d'action
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}