import { useState } from "react";
import { UserService } from "../../services/UserService.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import GoBackButton from "../../utils/GoBack.tsx";
import FileInput from "../form/input/FileInput.tsx";
import swal from 'sweetalert';

export default function AddUserForm() {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const optionsdep = [
        { value: "qualite", label: "Qualité" },
        { value: "informatique", label: "Informatique" },
    ];

    const optionsZone = [
        { value: "zone A", label: "Zone A" },
        { value: "zone B", label: "Zone B" },
    ];

    const optionStatut = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
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

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.nom) newErrors.nom = "Le nom est requis";
        if (!formData.prenom) newErrors.prenom = "Le prénom est requis";
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

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true);
        try {
            await UserService.create(formData);
            swal({
                title: "Good job!",
                text: "Le demande a été ajoutée, veuillez donner les droits d'accès pour cet utilisateur.",
                icon: "success",
            }).then(function () {
                window.location.href = "/utilisateurs";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Erreur lors de l'ajout de l'utilisateur.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta title="Ajouter utilisateur" description="Formulaire" />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>

            <ComponentCard title="Ajouter un Utilisateur">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input type="text" id="nom" onChange={handleChange} error={!!errors.nom} success={!!formData.nom} />
                        {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
                    </div>
                    <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input type="text" id="prenom" onChange={handleChange} error={!!errors.prenom} success={!!formData.prenom} />
                        {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" onChange={handleChange} error={!!errors.email} success={!!formData.email} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="matricul">Matricule</Label>
                        <Input type="text" id="matricul" onChange={handleChange} error={!!errors.matricul} success={!!formData.matricul} />
                        {errors.matricul && <p className="text-red-500 text-sm">{errors.matricul}</p>}
                    </div>
                    <div>
                        <Label htmlFor="nature">Nature</Label>
                        <Input type="text" id="nature" onChange={handleChange} error={!!errors.nature} success={!!formData.nature} />
                        {errors.nature && <p className="text-red-500 text-sm">{errors.nature}</p>}
                    </div>
                    <div>
                        <Label>Département</Label>
                        <Select
                            options={optionsdep}
                            placeholder="Select"
                            onChange={(val) => handleSelectChange(val, "departement")}
                        />
                        {errors.departement && <p className="text-red-500 text-sm">{errors.departement}</p>}
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Select
                            options={optionsZone}
                            placeholder="Select"
                            onChange={(val) => handleSelectChange(val, "zone")}
                        />
                        {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                    </div>
                    <div>
                        <Label>Statut</Label>
                        <Select
                            options={optionStatut}
                            placeholder="Select"
                            onChange={(val) => handleSelectChange(val, "statut")}
                        />
                        {errors.statut && <p className="text-red-500 text-sm">{errors.statut}</p>}
                    </div>
                </div>

                <div>
                    <Label>Upload Image</Label>
                    <FileInput onChange={handleFileChange} />
                    {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                </div>

                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        {loading ? "Ajout..." : "Ajouter Utilisateur"}
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}
