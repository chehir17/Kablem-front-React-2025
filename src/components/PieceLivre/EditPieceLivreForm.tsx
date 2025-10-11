import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";
import { Piece } from "../../types/Piece";
import { ClientService } from "../../services/ClientService";
import { Client } from "../../types/Client";
import { Fournisseur } from "../../types/Fournisseur";
import { FournisseurService } from "../../services/FournisseurService";
import { PieceLivreService } from "../../services/PieceLivreService";
import Select from "../form/Select";

interface EditPieceLivreModalProps {
    isOpen: boolean;
    onClose: () => void;
    pieceLivre: Piece | null;
    onSave: (updatedPiece: Piece) => void;
}

export default function EditPieceLivreModal({
    isOpen,
    onClose,
    pieceLivre,
    onSave,
}: EditPieceLivreModalProps) {
    const [formData, setFormData] = useState({
        id_piece: 0,
        id_client: "",
        p1_p2: 0,
        p3: 0,
        id_fournisseur: "",
        month: "",
    });

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

    const fetchClients = async () => {
        try {
            const data = await ClientService.getClient();
            setClients(data);
        } catch (err) {
            console.log("Impossible de charger les clients.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFournisseur = async () => {
        try {
            const data = await FournisseurService.getFournisseur();
            setFournisseurs(data);
        } catch (err) {
            console.log("Impossible de charger les fournisseurs.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pieceLivre) {
            setFormData(pieceLivre);
        }
        fetchClients();
        fetchFournisseur();
    }, [pieceLivre]);

    const options = [
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ];

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        // setErrors({ ...errors, [field]: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
         console.log(formData)
        try {
            setLoading(true);
            const updated = await PieceLivreService.updatePieceLivre(formData.id_piece, formData);
            console.log(" Piece mis à jour :", updated);
            onSave(updated);
            onClose();
            swal({
                title: "succès !",
                text: " Piece est à jour !",
                icon: "success",
            })

            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de Piece !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Piéce livré N° "{formData.id_piece}"
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label htmlFor="pcs_client">Piéce livré client</Label>
                                <Select
                                    options={clients.length > 0
                                        ? clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                        : [{ value: "", label: "Aucun client disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "id_client")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="p1_p2">Piéce livré P1_P2</Label>
                                <Input
                                    type="number"
                                    id="p1_p2"
                                    name="p1_p2"
                                    value={formData.p1_p2}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="p3">iéce livré P3</Label>
                                <Input
                                    type="number"
                                    id="p3"
                                    name="p3"
                                    value={formData.p3}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pcs_fournisseur">Piéce livré Fournisseur</Label>
                                <Select
                                    options={fournisseurs.length > 0
                                        ? fournisseurs.map(dep => ({ value: String(dep.id_fournisseur), label: dep.nom_fournisseur }))
                                        : [{ value: "", label: "Aucun fournisseur disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "id_fournisseur")}
                                />
                            </div>
                        </div>
                        <div className="mt-5 mb-3">
                            <Label>Mois</Label>
                            <Select
                                options={options}
                                placeholder="Selecter une mois"
                                onChange={(val) => handleSelectChange(val, "month")}
                                className="dark:bg-dark-900"
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