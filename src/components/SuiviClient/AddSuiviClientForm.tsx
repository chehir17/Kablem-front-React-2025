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


export default function AddSuiviClientForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const optionsZone = [
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

    const optionsPhaseProjet = [
        { value: "Fabrication", label: "Fabrication" },
        { value: "Montage", label: "Montage" },
        { value: "Inspection", label: "Inspection" },
        { value: "Livraison", label: "Livraison" },
    ];

    const OptionsTypeincident = [
        { value: "Type de Incident", label: "Type de Incident" },
        { value: "Réclamation interne group", label: "Réclamation interne group" },
        { value: "alerte", label: "alerte" },
        { value: "Réclamation client", label: "Réclamation client" },
        { value: "Prototypes", label: "Prototypes" },
    ]

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
            <ComponentCard title="Ajouter un Suivi Incident Client">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-4">
                    <div>
                        <Label htmlFor="num_rec_cli">N° reclamation client</Label>
                        <Input
                            type="text"
                            id="num_rec_cli"
                            name="num_rec_cli"
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_rec_cli"
                            label="Date reclamation client"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                console.log(selectedDate);
                            }}
                        />
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Select
                            options={optionsZone}
                            placeholder="Sélectionner une Zone"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Réf(code-produit)</Label>
                        <Select
                            options={optionsCodeArticle}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Projet</Label>
                        <Input
                            type="text"
                            id="nom_projet"
                            name="nom_projet"
                        />
                    </div>
                    <div>
                        <Label>phase de projet</Label>
                        <Select
                            options={optionsPhaseProjet}
                            placeholder="Sélectionner une Phase"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="desc_deff">Description du défaut</Label>
                        <Input
                            type="text"
                            id="desc_deff"
                            name="desc_deff"
                        />
                    </div>
                    <div>
                        <Label>Photo OK</Label>
                        <FileInput onChange={handleFileChange} className="w-full" />
                    </div>
                    <div>
                        <Label>Photo Non Ok</Label>
                        <FileInput onChange={handleFileChange} className="w-full" />
                    </div>

                    <div>
                        <Label htmlFor="nbr_piec_ko">nombre piéce KO</Label>
                        <Input
                            type="text"
                            id="nbr_piec_ko"
                            name="nbr_piec_ko"
                        />
                    </div>
                    <div>
                        <Label>Type incident </Label>
                        <Select
                            options={OptionsTypeincident}
                            placeholder="Sélectionner un type"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Numéro Reclamation fournisseur </Label>
                        <Select
                            options={optionsClients}
                            placeholder="Sélectionner un Fournisseur"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Clients </Label>
                        <Select
                            options={optionsClients}
                            placeholder="Sélectionner un client"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>

                        <Label htmlFor="recurence">Recurence</Label>
                        <Input
                            type="text"
                            id="recurence"
                            name="recurence"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cout_non_quat_s_rec">CNQ</Label>
                        <Input
                            type="text"
                            id="cout_non_quat_s_rec"
                            name="cout_non_quat_s_rec"
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
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter un utilisateur`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter Suivi Incident Client
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}