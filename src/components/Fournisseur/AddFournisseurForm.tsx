import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";
import { useState } from "react";
import { FournisseurService } from "../../services/FournisseurService.tsx";

export default function AddFournisseurForm() {
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        id_fournisseur: "",
        nom_fournisseur: "",
        ref_fournisseur: "",
        classification: "",
        email: "",
        status: "",
    });

    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    const classification = [
        { value: "C1", label: "C1" },
        { value: "C2", label: "C2" },
        { value: "C3", label: "C3" },
    ];

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.nom_fournisseur) newErrors.nom_fournisseur = "Le nom du fournisseur est requis";
        if (!formData.ref_fournisseur) newErrors.ref_fournisseur = "La référence est requise";
        if (!formData.classification) newErrors.classification = "La classification est requise";
        if (!formData.email) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email invalide";
        }
        if (!formData.status) newErrors.status = "Le statut est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFournisseur = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log("📤 Données envoyées :", formData);

            const res = await FournisseurService.createFournisseur(formData);

            swal({
                title: "Succès !",
                text: "Le  a fournisseur été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.error("❌ Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ComponentCard title="Ajouter un Fournisseur">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="nom_fournisseur">Nom de Fournisseur</Label>
                    <Input
                        type="text"
                        id="nom_fournisseur"
                        onChange={handleChange}
                        error={!!errors.nom_fournisseur}
                        success={!!formData.nom_fournisseur}
                    />
                    {errors.nom_fournisseur && <p className="text-red-500 text-sm">{errors.nom_fournisseur}</p>}
                </div>
                <div>
                    <Label htmlFor="ref_fournisseur">Reference de Fournisseur</Label>
                    <Input
                        type="text"
                        id="ref_fournisseur"
                        placeholder=""
                        onChange={handleChange}
                        error={!!errors.ref_fournisseur}
                        success={!!formData.ref_fournisseur}
                    />
                    {errors.ref_fournisseur && <p className="text-red-500 text-sm">{errors.ref_fournisseur}</p>}
                </div>
                <div>
                    <Label htmlFor="classification">Classification</Label>
                    <Select
                        options={classification}
                        placeholder="Selecter une classification"
                        onChange={(val) => handleSelectChange(val, "classification")}
                        className="dark:bg-dark-900"
                    />
                    {errors.classification && <p className="text-red-500 text-sm">{errors.classification}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="info@gmail.com"
                        onChange={handleChange}
                        error={!!errors.email}
                        success={!!formData.email}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select
                        options={options}
                        placeholder="Selecter un statut"
                        onChange={(val) => handleSelectChange(val, "status")}
                        className="dark:bg-dark-900"
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
            </div>
            <div className="flex items-center justify-center h-full">
                <button
                    type="button"
                    onClick={handleFournisseur}
                    className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                </button>
            </div>
        </ComponentCard>
    );
}
