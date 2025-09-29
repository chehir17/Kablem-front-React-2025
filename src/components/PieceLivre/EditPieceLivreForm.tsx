import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";

interface EditPieceLivreModalProps {
    isOpen: boolean;
    onClose: () => void;
    pieceLivre: {
        id: number;
        pcs_client: string;
        pcs_p1_p2: string;
        pcs_p3: string;
        pcs_fournisseur: string;
        pcs_month: Date,
    } | null;
    onSave: (updatedPiece: {
        id: number;
        pcs_client: string;
        pcs_p1_p2: string;
        pcs_p3: string;
        pcs_fournisseur: string;
        pcs_month: Date,
    }) => void;
}

export default function EditPieceLivreModal({
    isOpen,
    onClose,
    pieceLivre,
    onSave,
}: EditPieceLivreModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        pcs_client: "",
        pcs_p1_p2: "",
        pcs_p3: "",
        pcs_fournisseur: "",
        pcs_month: new Date(),
    });

    useEffect(() => {
        if (pieceLivre) {
            setFormData(pieceLivre);
        }
    }, [pieceLivre]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = () => {
        onSave(formData);
        console.log("Ligne mis à jour :", formData);
        onClose();
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Piéce livré N° "{formData.id}"
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label htmlFor="pcs_client">Piéce livré client</Label>
                                <Input
                                    type="text"
                                    id="pcs_client"
                                    name="pcs_client"
                                    value={formData.pcs_client}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="pcs_p1_p2">Piéce livré P1_P2</Label>
                                <Input
                                    type="text"
                                    id="pcs_p1_p2"
                                    name="pcs_p1_p2"
                                    value={formData.pcs_p1_p2}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pcs_p3">iéce livré P3</Label>
                                <Input
                                    type="text"
                                    id="pcs_p3"
                                    name="pcs_p3"
                                    value={formData.pcs_p3}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pcs_fournisseur">Piéce livré Fournisseur</Label>
                                <Input
                                    type="text"
                                    id="pcs_fournisseur"
                                    name="pcs_fournisseur"
                                    value={formData.pcs_fournisseur}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mt-5 mb-3">
                            <DatePicker
                                id="mois"
                                label="Mois"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    // Récupère la première date sélectionnée (si c'est un tableau)
                                    const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                    setFormData({
                                        ...formData,
                                        pcs_month: selectedDate || new Date(),
                                    });
                                }}
                            />
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