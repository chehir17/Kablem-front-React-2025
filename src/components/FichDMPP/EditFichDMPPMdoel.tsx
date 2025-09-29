import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";

interface EditFichDMPPModalProps {
    isOpen: boolean;
    onClose: () => void;
    fichdmpps: {
        id: number;
        nom_ligne: string;
        post: string;
        code_artc: string;
        nature: string;
        zone: string;
        date_sou: Date,
        type: string;
        nom_client: string;
        cout_estimative: string;
        etat_actu: string;
        etat_modif: string;
        objectif_modif: string;
    } | null;
    onSave: (updatedFichdmpp: {
        id: number;
        nom_ligne: string;
        post: string;
        code_artc: string;
        nature: string;
        zone: string;
        date_sou: Date;
        type: string;
        nom_client: string;
        cout_estimative: string;
        etat_actu: string;
        etat_modif: string;
        objectif_modif: string;
    }) => void;
}

export default function EditFIchDMPPModal({
    isOpen,
    onClose,
    fichdmpps,
    onSave,
}: EditFichDMPPModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nom_ligne: "",
        post: "",
        code_artc: "",
        nature: "",
        zone: "",
        date_sou: new Date(),
        type: "",
        nom_client: "",
        cout_estimative: "",
        etat_actu: "",
        etat_modif: "",
        objectif_modif: "",
    });

    useEffect(() => {
        if (fichdmpps) {
            setFormData(fichdmpps);
        }
    }, [fichdmpps]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, code_artc: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        console.log("Ligne mis à jour :", formData);
        onClose();
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
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Fich DMPP N°{formData.id}
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label>Ligne</Label>
                                <Select
                                    options={optionsLigne}
                                    placeholder="Sélectionner un code"
                                    onChange={handleSelectChange}
                                    value={formData.nom_ligne}
                                />
                            </div>

                            <div>
                                <Label htmlFor="post">Post</Label>
                                <Input
                                    type="text"
                                    id="post"
                                    name="post"
                                    value={formData.post}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Code Article</Label>
                                <Select
                                    options={optionsCodeArticle}
                                    placeholder="Sélectionner un code"
                                    onChange={handleSelectChange}
                                    value={formData.code_artc}
                                />
                            </div>
                            <div>
                                <Label htmlFor="nature">Nature</Label>
                                <Input
                                    type="text"
                                    id="nature"
                                    name="nature"
                                    value={formData.nature}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Input
                                    type="text"
                                    id="zone"
                                    name="zone"
                                    value={formData.zone}
                                    onChange={handleChange}
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
                                        setFormData({
                                            ...formData,
                                            date_sou: selectedDate || new Date(),
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Nom Client</Label>
                                <Select
                                    options={optionsClients}
                                    placeholder="Sélectionner un nom"
                                    onChange={handleSelectChange}
                                    value={formData.nom_client}
                                />
                            </div>
                            <div>
                                <Label>Cout estimative</Label>
                                <Input
                                    type="number"
                                    id="cout_estimative"
                                    name="cout_estimative"
                                    value={formData.cout_estimative}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>état actuel </Label>
                                <Select
                                    options={optionsEtat}
                                    placeholder="Sélectionner une etat"
                                    onChange={handleSelectChange}
                                    value={formData.etat_actu}
                                />
                            </div>
                            <div>
                                <Label>Etat de modification</Label>
                                <Input
                                    type="text"
                                    id="etat_modif"
                                    name="etat_modif"
                                    value={formData.etat_modif}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-5">
                                <Label>Objectif de modification</Label>
                                <Input
                                    type="text"
                                    id="objectif_modif"
                                    name="objectif_modif"
                                    value={formData.objectif_modif}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-0 lg:justify-end">
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