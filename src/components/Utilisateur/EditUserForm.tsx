import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";

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
        departement: "",
        statut: "",
        image: "",
        zone: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.first_name) newErrors.first_name = "Le nom est requis";
        if (!formData.last_name) newErrors.last_name = "Le prénom est requis";
        if (!formData.email) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email invalide";
        }
        if (!formData.matricul) newErrors.matricul = "Le matricule est requis";
        if (!formData.nature) newErrors.nature = "La nature est requise";
        if (!formData.departement) newErrors.departement = "Le département est requis";
        if (!formData.zone) newErrors.zone = "La zone est requise";
        if (!formData.statut) newErrors.statut = "Le statut est requis";
        if (!formData.file) newErrors.file = "Le fichier est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors({ ...errors, file: "Le fichier doit être une image." });
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // max 2Mo
                setErrors({ ...errors, file: "La taille du fichier doit être inférieure à 2 Mo." });
                return;
            }
            setFormData({ ...formData, file });
            setErrors({ ...errors, file: "" });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const updatedUser = await UserService.update(formData.id, formData);
            onClose();
            swal({
                title: "Succès!",
                text: "Utilisateur mis à jour avec succès.",
                icon: "update",
            });
            onSave(updatedUser);
        } catch (error) {
            console.error("Erreur maj user :", error);
            swal({
                title: "Erreur!",
                text: "Erreur lors de la mise à jour de l'utilisateur.",
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
                            error={!!errors.first_name} success={!!formData.first_name}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="last_name">Prénom</Label>
                        <Input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={!!errors.last_name} success={!!formData.last_name}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email} success={!!formData.email}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <Label>Matricule</Label>
                        <Input
                            type="text"
                            id="matricul"
                            name="matricul"
                            value={formData.matricul}
                            onChange={handleChange}
                            error={!!errors.matricul} success={!!formData.matricul}
                        />
                        {errors.matricul && <p className="text-red-500 text-sm">{errors.matricul}</p>}
                    </div>

                    <div>
                        <Label>Nature</Label>
                        <Input
                            type="text"
                            id="nature"
                            name="nature"
                            value={formData.nature}
                            onChange={handleChange}
                            error={!!errors.nature} success={!!formData.nature}
                        />
                        {errors.nature && <p className="text-red-500 text-sm">{errors.nature}</p>}
                    </div>

                    <div>
                        <Label>Département</Label>
                        <Select
                            options={[
                                { value: "qualité", label: "Qualité" },
                                { value: "dep_extrusion", label: "Département extrusion" },
                            ]}
                            onChange={(val) => handleSelectChange(val, "departement")}
                            value={formData.departement}
                        />
                        {errors.departement && <p className="text-red-500 text-sm">{errors.departement}</p>}
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
                        {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
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
                        {errors.statut && <p className="text-red-500 text-sm">{errors.statut}</p>}
                    </div>

                    <div className="col-span-2">
                        <Label>Upload Image</Label>
                        <FileInput onChange={handleFileChange} />
                        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
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
