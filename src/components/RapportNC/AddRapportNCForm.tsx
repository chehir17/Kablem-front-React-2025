import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import DatePicker from "../form/date-picker";
import { Action } from "@fullcalendar/core/internal";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";


export default function AddRapportNcFrom() {




    const optionsProcess = [
        { value: "p1", label: "P1" },
        { value: "p2", label: "P2" },
        { value: "p3", label: "P3" },
    ];

    const optionsClients = [
        { value: "mostfa", label: "Mostfa" },
        { value: "hmed", label: "hmed" },
    ];


    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
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

            <ComponentCard title="Ajouter Rapport de non conformité">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="code_article">Code Article</Label>
                        <Select
                            options={optionsCodeArticle}
                            placeholder="Sélectionner une zone"
                            onChange={handleSelectChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="lot">N° de Lot/ Date</Label>
                        <Input
                            type="text"
                            id="lot"
                            name="lot"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="sujet">Sujet de Non Conformité</Label>
                        <Input
                            type="text"
                            id="sujet"
                            name="sujet"
                            className="w-full"
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
                        <Label>Photo Identité</Label>
                        <FileInput onChange={handleFileChange} className="w-full" />
                    </div>

                    <div>
                        <Label htmlFor="quantite_nc">Quantité NC</Label>
                        <Input
                            type="text"
                            id="quantite_nc"
                            name="quantite_nc"
                            className="w-full"
                        />
                    </div>


                    <div>
                        <Label>Process</Label>
                        <Select
                            options={optionsProcess}
                            placeholder="Sélectionner un département"
                            onChange={handleSelectChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <Label>Nom Client</Label>
                        <Select
                            options={optionsClients}
                            placeholder="Sélectionner un département"
                            className="w-full"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="occurance_defaut">Occurence au Défaut</Label>
                        <Input
                            type="text"
                            id="occurance_defaut"
                            name="occurance_defaut"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <Label htmlFor="ac_immed">TRAITEMENT NC (Action Immédiate)</Label>
                        <Input
                            type="text"
                            id="ac_immed"
                            name="ac_immed"
                            className="w-full"
                        />
                    </div>
                    <div className="w_full">
                        <DatePicker
                            id="date_ac_immed"
                            label="Date de l'action Immediate"
                            placeholder="Select a date"
                            onChange={(dates, currentDateString) => {
                                // Handle your logic
                                console.log({ dates, currentDateString });
                            }}
                        />
                    </div>
                    <div className="w_full">
                        <DatePicker
                            id="date_verif_ac_immed"
                            label="Date de verification de l'action immediate"
                            placeholder="Select a date"
                            onChange={(dates, currentDateString) => {
                                // Handle your logic
                                console.log({ dates, currentDateString });
                            }}
                        />
                    </div>
                </div>
                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={() => alert(`Ajouter un Rapport NC`)}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                            type="submit"
                        >
                            Ajouter Rapport NC
                        </button>
                    </div>
            </ComponentCard>
        </div>
    );
}