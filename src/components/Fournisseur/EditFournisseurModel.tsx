import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";

interface Option {
    value: string;
    label: string;
}

interface EditFournisseurModalProps {
    isOpen: boolean;
    onClose: () => void;
    fournisseur: {
        id: number;
        nom_fournisseur: string;
        reference_fournisseur: string;
        classification: string;
        email: string;
        status: string;
    } | null;
    onSave: (updatedFournisseur: {
        id: number;
        nom_fournisseur: string;
        reference_fournisseur: string;
        classification: string;
        email: string;
        status: string;
    }) => void;
}

export default function EditFournisseurModal({
    isOpen,
    onClose,
    fournisseur,
    onSave,
}: EditFournisseurModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nom_fournisseur: "",
        reference_fournisseur: "",
        classification: "",
        email: "",
        status: "",
    });

    const typeOptions: Option[] = [
        { value: "Matiere Premiere", label: "Matiere Premiere" },
        { value: "Produit Final", label: "Produit Final" },
    ];

    useEffect(() => {
        if (fournisseur) {
            setFormData(fournisseur);
        }
    }, [fournisseur]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, status: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        console.log("Fournisseur mis à jour :", formData);
        onClose();
    };

    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier le Fournisseur
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nom_fournisseur">Nom Fournisseur</Label>
                                <Input
                                    type="text"
                                    id="nom_fournisseur"
                                    name="nom_fournisseur"
                                    value={formData.nom_fournisseur}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="reference_fournisseur">Reference Fournisseur</Label>
                                <Input
                                    type="text"
                                    id="reference_fournisseur"
                                    name="reference_fournisseur"
                                    value={formData.reference_fournisseur}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="classification">Classification</Label>
                                <Input
                                    type="text"
                                    id="classification"
                                    name="classification"
                                    value={formData.classification}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Statut</Label>
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