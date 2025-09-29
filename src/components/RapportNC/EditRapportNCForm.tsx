import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import DatePicker from "../form/date-picker";
import { Action } from "@fullcalendar/core/internal";

interface EditRapportNcModalProps {
    isOpen: boolean;
    onClose: () => void;
    rapportnc: {
        id: number;
        date: string;
        code_article: string;
        lot: string;
        sujet: string;
        photo_ok?: string;
        photo_nok?: string;
        photo_idant?: string;
        quantite_nc: number;
        process: string;
        client: string;
        occurance_defaut: string;
        ac_immed: string;
        date_ac_immed: string;
        date_verif_ac_immed: string;
        ac_ap: { id: number; type: "ac" | "ap"; description: string }[];
    } | null;
    onSave: (updatedRapports: {
        id: number;
        date: string;
        code_article: string;
        lot: string;
        sujet: string;
        photo_ok?: string;
        photo_nok?: string;
        photo_idant?: string;
        quantite_nc: number;
        process: string;
        client: string;
        occurance_defaut: string;
        ac_immed: string;
        date_ac_immed: string;
        date_verif_ac_immed: string;
        ac_ap: { id: number; type: "ac" | "ap"; description: string }[];

    }) => void;
}

export default function EditRapportNcModal({
    isOpen,
    onClose,
    rapportnc,
    onSave,
}: EditRapportNcModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        date: "",
        code_article: "",
        lot: "",
        sujet: "",
        photo_ok: "",
        photo_nok: "",
        photo_idant: "",
        quantite_nc: 0,
        process: "",
        client: "",
        occurance_defaut: "",
        ac_immed: "",
        date_ac_immed: new Date(),
        date_verif_ac_immed: new Date(),
    });

    useEffect(() => {
        if (rapportnc) {
            setFormData({
                id: rapportnc.id,
                date: rapportnc.date || "",
                code_article: rapportnc.code_article || "",
                lot: rapportnc.lot || "",
                sujet: rapportnc.sujet || "",
                photo_ok: rapportnc.photo_ok ?? "", 
                photo_nok: rapportnc.photo_nok ?? "",
                photo_idant: rapportnc.photo_idant ?? "",
                quantite_nc: rapportnc.quantite_nc ?? 0,
                process: rapportnc.process || "",
                client: rapportnc.client || "",
                occurance_defaut: rapportnc.occurance_defaut || "",
                ac_immed: rapportnc.ac_immed || "",
                date_ac_immed: rapportnc.date_ac_immed ? new Date(rapportnc.date_ac_immed) : new Date(),
                date_verif_ac_immed: rapportnc.date_verif_ac_immed ? new Date(rapportnc.date_verif_ac_immed) : new Date(),
            });
        }
    }, [rapportnc]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectCodeArticleChange = (value: string) => {
        setFormData({ ...formData, code_article: value });
    };

    const handleSelectProcessChange = (value: string) => {
        setFormData({ ...formData, process: value });
    };

    const handleSelectClientChange = (value: string) => {
        setFormData({ ...formData, client: value });
    };


    const handleSubmit = () => {
        if (!rapportnc) return;

        const updatedRapport = {
            ...formData,
            date_ac_immed: formData.date_ac_immed.toISOString(),
            date_verif_ac_immed: formData.date_verif_ac_immed.toISOString(),
            ac_ap: rapportnc.ac_ap,
        };

        onSave(updatedRapport);
        onClose();
    };

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
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] max-h-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-auto max-h-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Rapport "{formData.sujet}"
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="code_article">Code Article</Label>
                                <Select
                                    options={optionsCodeArticle}
                                    placeholder="Sélectionner une zone"
                                    onChange={handleSelectCodeArticleChange}
                                    value={formData.code_article}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="lot">N° de Lot/ Date</Label>
                                <Input
                                    type="text"
                                    id="lot"
                                    name="lot"
                                    value={formData.lot}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="sujet">Sujet de Non Conformité</Label>
                                <Input
                                    type="text"
                                    id="sujet"
                                    name="sujet"
                                    value={formData.sujet}
                                    onChange={handleChange}
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
                                    value={formData.quantite_nc}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label>Process</Label>
                                <Select
                                    options={optionsProcess}
                                    placeholder="Sélectionner un département"
                                    onChange={handleSelectProcessChange}
                                    value={formData.process}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label>Nom Client</Label>
                                <Select
                                    options={optionsClients}
                                    placeholder="Sélectionner un département"
                                    onChange={handleSelectClientChange}
                                    value={formData.client}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="occurance_defaut">Occurence au Défaut</Label>
                                <Input
                                    type="text"
                                    id="occurance_defaut"
                                    name="occurance_defaut"
                                    value={formData.occurance_defaut}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="ac_immed">TRAITEMENT NC (Action Immédiate)</Label>
                                <Input
                                    type="text"
                                    id="ac_immed"
                                    name="ac_immed"
                                    value={formData.ac_immed}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="w-full">
                                <DatePicker
                                    id="date_ac_immed"
                                    label="Date Action Immédiate"
                                    placeholder="Select a date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData({
                                            ...formData,
                                            date_ac_immed: selectedDate || new Date(),
                                        });
                                    }}
                                />
                            </div>

                            <div className="w-full">
                                <DatePicker
                                    id="date_verif_ac_immed"
                                    label="Date Vérification de l'action immédiate"
                                    placeholder="Select a date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData({
                                            ...formData,
                                            date_verif_ac_immed: selectedDate || new Date(),
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

    );
}