import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import { Client } from "../../types/Client";
import { ClientService } from "../../services/ClientService";

interface Option {
    value: string;
    label: string;
}

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    onSave: (updatedClient: Client) => void;
}

export default function EditClientModal({
    isOpen,
    onClose,
    client,
    onSave,
}: EditClientModalProps) {
    const [formData, setFormData] = useState({
        id_client: 0,
        nom_client: "",
        ref: "",
        societe: "",
        email: "",
        status: "",
    });

    const [loading, setLoading] = useState(false);


    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    useEffect(() => {
        if (client) {
            setFormData(client);
        }
    }, [client]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, status: value });
    };

    const handleSubmit = async () => {

        try {
            setLoading(true);
            const updated = await ClientService.updateClient(formData.id_client, formData);
            console.log("✅ Article mis à jour :", updated);
            onSave(updated);
            swal({
                title: "succès !",
                text: " Client mis à jour !",
                icon: "success",
            })
            onClose();
            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de client !",
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
                    Modifier le client
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="code_client">Nom client</Label>
                                <Input
                                    type="text"
                                    id="code_client"
                                    name="code_client"
                                    value={formData.nom_client}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ref">Reference Client</Label>
                                <Input
                                    type="text"
                                    id="ref"
                                    name="ref"
                                    value={formData.ref}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="societe">Organisme/Société</Label>
                                <Input
                                    type="text"
                                    id="societe"
                                    name="societe"
                                    value={formData.societe}
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
                            className={`px-4 py-2 text-sm text-white rounded ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}