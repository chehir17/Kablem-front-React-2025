import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";

interface EditLigneModalProps {
    isOpen: boolean;
    onClose: () => void;
    ligne: {
        id: number;
        nom_ligne: string;
        ref_ligne: string;
        departement: string;
        Capacite_production: number;
        Resp_ligne: string;
        Date_maintenance: Date;
        proch_entretien: Date;
        status: string;
    } | null;
    onSave: (updatedLigne: {
        id: number;
        nom_ligne: string;
        ref_ligne: string;
        departement: string;
        Capacite_production: number;
        Resp_ligne: string;
        Date_maintenance: Date;
        proch_entretien: Date;
        status: string;
    }) => void;
}

export default function EditLigneModal({
    isOpen,
    onClose,
    ligne,
    onSave,
}: EditLigneModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nom_ligne: "",
        ref_ligne: "",
        departement: "",
        Capacite_production: 0,
        Resp_ligne: "",
        Date_maintenance: new Date(),
        proch_entretien: new Date(),
        status: "",
    });

    useEffect(() => {
        if (ligne) {
            setFormData(ligne);
        }
    }, [ligne]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, status: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        console.log("Ligne mis à jour :", formData);
        onClose();
    };

    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    const departementOptions = [
        { value: "qualité", label: "Qualité" },
        { value: "dep_extrusion", label: "Département extrusion" },
        { value: "dep_cablage", label: "Département câblage" },
        { value: "dep_assemblage", label: "Département assemblage" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier "{formData.nom_ligne}"
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label htmlFor="nom_ligne">Nom ligne</Label>
                                <Input
                                    type="text"
                                    id="nom_ligne"
                                    name="nom_ligne"
                                    value={formData.nom_ligne}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ref_ligne">Référence Ligne</Label>
                                <Input
                                    type="text"
                                    id="ref_ligne"
                                    name="ref_ligne"
                                    value={formData.ref_ligne}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Département</Label>
                                <Select
                                    options={departementOptions}
                                    placeholder="Sélectionner un département"
                                    onChange={handleSelectChange}
                                    value={formData.departement}
                                />
                            </div>
                            <div>
                                <Label htmlFor="Capacite_production">Capacité de production</Label>
                                <Input
                                    type="number"
                                    id="Capacite_production"
                                    name="Capacite_production"
                                    value={formData.Capacite_production}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="Resp_ligne">Responsable de ligne</Label>
                                <Input
                                    type="text"
                                    id="Resp_ligne"
                                    name="Resp_ligne"
                                    value={formData.Resp_ligne}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="Date_maintenance"
                                    label="Date de maintenance"
                                    placeholder="Select a date"
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData({
                                            ...formData,
                                            Date_maintenance: selectedDate || new Date(),
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="proch_entretien"
                                    label="Prochaine maintenance"
                                    placeholder="Select a date"
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData({
                                            ...formData,
                                            proch_entretien: selectedDate || new Date(),
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select
                                    options={options}
                                    placeholder="Sélectionner un statut"
                                    onChange={handleSelectChange}
                                    value={formData.status}
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