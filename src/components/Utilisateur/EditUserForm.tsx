import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import swal from "sweetalert";
import { DepartementService } from "../../services/DepartementService";
import { Departement } from "../../types/Departement";
import { AutoPassword, EyeCloseIcon, EyeIcon } from "../../icons";
import { handleGeneratePassword } from "../../utils/GenratePassword";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any | null;
    onSave: (updatedUser: any) => void;
}

export default function EditUserModal({
    isOpen,
    onClose,
    user,
    onSave,
}: EditUserModalProps) {
    const [formData, setFormData] = useState<any>({
        id: 0,
        first_name: "",
        last_name: "",
        email: "",
        matricul: "",
        nature: "",
        id_departement: "",
        statut: "",
        zone: "",
        password:"",
        photo: null,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [departementError, setDepartementError] = useState<any>({});
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                photo: null,
            });
        }
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
        fetchDepartements();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors({ ...errors, photo: "Le fichier doit être une image." });
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setErrors({
                    ...errors,
                    photo: "La taille du fichier doit être inférieure à 2 Mo.",
                });
                return;
            }
            setFormData({ ...formData, photo: file });
            setErrors({ ...errors, photo: "" });
        }
    };

    const validateForm = () => {
        let newErrors: any = {};
        if (!formData.first_name) newErrors.first_name = "Le nom est requis";
        if (!formData.last_name) newErrors.last_name = "Le prénom est requis";
        if (!formData.email) newErrors.email = "L'email est requis";
        if (!formData.matricul) newErrors.matricul = "Le matricule est requis";
        if (!formData.nature) newErrors.nature = "La nature est requise";
        if (!formData.zone) newErrors.zone = "La zone est requise";
        if (!formData.statut) newErrors.statut = "Le statut est requis";
        if (!formData.id_departement)
            newErrors.id_departement = "Le département est requis";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("first_name", formData.first_name);
            dataToSend.append("last_name", formData.last_name);
            dataToSend.append("email", formData.email);
            dataToSend.append("matricul", formData.matricul);
            dataToSend.append("nature", formData.nature);
            dataToSend.append("statut", formData.statut);
            dataToSend.append("id_departement", formData.id_departement);
            dataToSend.append("zone", formData.zone);
            if (formData.photo) {
                dataToSend.append("photo", formData.photo);
            }

            const updatedUser = await UserService.update(formData.id, dataToSend);
            swal({
                title: "Succès",
                text: "Utilisateur mis à jour avec succès",
                icon: "success",
            });
            onSave(updatedUser);
            onClose();
        } catch (error) {
            console.error("Erreur mise à jour utilisateur :", error);
            swal({
                title: "Erreur",
                text: "Échec de la mise à jour de l'utilisateur",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl">
                <h4 className="mb-4 text-2xl font-semibold">
                    Modifier "{formData.first_name} {formData.last_name}"
                </h4>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="first_name">Nom</Label>
                        <Input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm">{errors.first_name}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="last_name">Prénom</Label>
                        <Input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm">{errors.last_name}</p>
                        )}
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <Label>Matricule</Label>
                        <Input
                            type="text"
                            id="matricul"
                            name="matricul"
                            value={formData.matricul}
                            onChange={handleChange}
                            error={!!errors.matricul}
                        />
                        {errors.matricul && (
                            <p className="text-red-500 text-sm">{errors.matricul}</p>
                        )}
                    </div>

                    <div>
                        <Label>Nature</Label>
                        <Input
                            type="text"
                            id="nature"
                            name="nature"
                            value={formData.nature}
                            onChange={handleChange}
                            error={!!errors.nature}
                        />
                        {errors.nature && (
                            <p className="text-red-500 text-sm">{errors.nature}</p>
                        )}
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
                        {errors.id_departement && (
                            <p className="text-red-500 text-sm">{errors.id_departement}</p>
                        )}
                    </div>

                    <div>
                        <Label>Zone</Label>
                        <Select
                            options={[
                                { value: "zone A", label: "Zone A" },
                                { value: "zone B", label: "Zone B" },
                            ]}
                            onChange={(val) => handleSelectChange(val, "zone")}
                            value={formData.zone}
                        />
                        {errors.zone && (
                            <p className="text-red-500 text-sm">{errors.zone}</p>
                        )}
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select
                            options={[
                                { value: "actif", label: "Actif" },
                                { value: "inactif", label: "Inactif" },
                            ]}
                            onChange={(val) => handleSelectChange(val, "statut")}
                            value={formData.statut}
                        />
                        {errors.statut && (
                            <p className="text-red-500 text-sm">{errors.statut}</p>
                        )}
                    </div>
                    <div>
                        <Label>
                            Mot de passe <span className="text-error-500">*</span>
                        </Label>

                        <div className="relative">
                            {/* Input avec padding à droite pour laisser place aux icônes */}
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Entrez votre mot de passe"
                                value={formData.password || ""}
                                onChange={handleChange}
                                error={!!errors.password}
                                success={!!formData.password}
                                name="password"
                                id="password"
                                className="pr-20" // espace pour icônes
                            />

                            {/* Container des icônes */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {/* Icône afficher/masquer */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="size-5 fill-gray-500" />
                                    ) : (
                                        <EyeCloseIcon className="size-5 fill-gray-500" />
                                    )}
                                </button>

                                {/* Icône génération mot de passe */}
                                <button
                                    type="button"
                                    onClick={() => handleGeneratePassword(formData, setFormData)}
                                    className="p-1"
                                >
                                    <AutoPassword className="size-5 fill-green-500" />
                                </button>
                            </div>
                        </div>

                        {/* Message d’erreur */}
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <Label>Confirme mot de passe</Label>
                        <Input
                            placeholder="Confirme mot de passe"
                            type="password"
                            value={formData.confPassword || ""}
                            onChange={handleChange}
                            error={!!errors.confPassword}
                            success={!!formData.confPassword}
                            name="confPassword"
                            id="confPassword"
                        />
                        {errors.confPassword && (
                            <p className="text-red-500 text-sm">{errors.confPassword}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <Label>Upload Image</Label>
                        <FileInput onChange={handleFileChange} />
                        {errors.photo && (
                            <p className="text-red-500 text-sm">{errors.photo}</p>
                        )}
                    </div>
                </form>

                <div className="flex justify-end gap-3 mt-6">
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
                        disabled={loading}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                        {loading ? "Mise à jour..." : "Sauvegarder"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
