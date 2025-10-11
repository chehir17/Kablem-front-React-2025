import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";
import { Ligne } from "../../types/Ligne";
import { LigneService } from "../../services/LigneService";
import { Utilisateur } from "../../types/Utilisateur";
import { Departement } from "../../types/Departement";
import { DepartementService } from "../../services/DepartementService";
import { UserService } from "../../services/UserService";

interface EditLigneModalProps {
    isOpen: boolean;
    onClose: () => void;
    ligne: Ligne | null;
    onSave: (updatedLigne: Ligne) => void;
}

export default function EditLigneModal({
    isOpen,
    onClose,
    ligne,
    onSave,
}: EditLigneModalProps) {
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [user, setUser] = useState<Utilisateur[]>([]);
    const [departementError, setDepartementError] = useState<any>({});

    const [formData, setFormData] = useState({
        id_ligne: 0,
        nom_ligne: "",
        ref: "",
        departement: "",
        cap_production: 0,
        responsable: "",
        Date_maintenance: new Date(),
        proch_entretien: new Date(),
        status: "",
    });

    const [loading, setLoading] = useState(false);

    const fetchDepartements = async () => {
        try {
            const data = await DepartementService.getDepartements();
            setDepartements(data);
        } catch (err) {
            setDepartementError("Impossible de charger les départements.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const users = await UserService.getUsers();
            setUser(users);
        } catch (err) {
            setDepartementError("Impossible de charger les utilisateurs.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ligne) {
            setFormData(ligne);
        }
        fetchDepartements();
        fetchUsers();
    }, [ligne]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        // setErrors({ ...errors, [field]: "" });
    };

    const handleSubmit = async () => {

        try {
            setLoading(true);
            const updated = await LigneService.updateLigne(formData.id_ligne, formData);
            console.log(" Ligne mis à jour :", updated);
            onSave(updated);
            swal({
                title: "succès !",
                text: " Ligne est à jour !",
                icon: "success",
            })
            onClose();
            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de Ligne !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-2">
            <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
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
                                    value={formData.ref}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Département</Label>
                                <Select
                                    options={departements.length > 0
                                        ? departements.map(dep => ({ value: String(dep.id_departement), label: dep.nom_departement }))
                                        : [{ value: "", label: "Aucun département disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "departement")}
                                />
                            </div>
                            <div>
                                <Label htmlFor="Capacite_production">Capacité de production</Label>
                                <Input
                                    type="number"
                                    id="Capacite_production"
                                    name="Capacite_production"
                                    value={formData.cap_production}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="responsable">Responsable de ligne</Label>
                                <Select
                                    options={user.length > 0
                                        ? user.map(user => ({ value: String(user.id_user), label: user.first_name }))
                                        : [{ value: "", label: "Aucun utilisateur disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "responsable")}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="Date_maintenance"
                                    label="Date de maintenance"
                                    placeholder="Select a date"
                                    onChange={(dates,) => {
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
                                    onChange={(val) => handleSelectChange(val, "status")}
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