import { useEffect, useState } from "react";
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
import { AutoPassword, EyeCloseIcon, EyeIcon } from "../../icons/index.ts";
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { DepartementService } from "../../services/DepartementService.tsx";
import { Departement } from "../../types/Departement.tsx";
import { handleGeneratePassword } from "../../utils/GenratePassword.ts";

export default function AddUserForm() {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [departementError, setDepartementError] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [departements, setDepartements] = useState<Departement[]>([]);

    useEffect(() => {
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
    }, []);

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

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
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
        if (!formData.password) newErrors.password = "Le mot de passe est requis";
        if (!formData.confPassword) newErrors.confPassword = "La confirmation du mot de passe est requise";
        if (formData.password && formData.confPassword && formData.password !== formData.confPassword) {
            newErrors.confPassword = "Les mots de passe ne correspondent pas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Création d’un FormData
            const formDataToSend = new FormData();

            // Ajouter tous les champs
            // ✅ Mapping des champs attendus par Laravel
            formDataToSend.append("first_name", formData.first_name || "");
            formDataToSend.append("last_name", formData.last_name || "");
            formDataToSend.append("email", formData.email || "");
            formDataToSend.append("matricul", formData.matricul || "");
            formDataToSend.append("nature", formData.nature || "");
            formDataToSend.append("id_departement", formData.departement || "");
            formDataToSend.append("zone", formData.zone || "");
            formDataToSend.append("statut", formData.statut || "");
            formDataToSend.append("password", formData.password || "");

            if (formData.file) {
                formDataToSend.append("photo", formData.file);
            }

            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }



            const response = await UserService.create(formDataToSend);

            console.log("Utilisateur créé :", response.data);

            // // Email d’envoi
            // await emailjs.send(
            //     "Kablem_email_service",
            //     "template_kablem",
            //     {
            //         to_email: formData.email,
            //         first_name: formData.first_name,
            //         last_name: formData.last_name,
            //         password: formData.password,
            //         email: formData.email,
            //     },
            //     "ytIgPKdJvOlJzFte5"
            // );

            swal({
                title: "Good job!",
                text: "L'utilisateur a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/utilisateurs";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Impossible d'ajouter l'utilisateur.",
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
                        <Label htmlFor="first_name">Nom</Label>
                        <Input type="text" id="first_name" name="first_name" onChange={handleChange} error={!!errors.first_name} success={!!formData.first_name} />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="last_name">Prénom</Label>
                        <Input type="text" id="last_name" name="last_name" onChange={handleChange} error={!!errors.last_name} success={!!formData.last_name} />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" onChange={handleChange} error={!!errors.email} success={!!formData.email} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="matricul">Matricule</Label>
                        <Input type="text" id="matricul" name="matricul" onChange={handleChange} error={!!errors.matricul} success={!!formData.matricul} />
                        {errors.matricul && <p className="text-red-500 text-sm">{errors.matricul}</p>}
                    </div>
                    <div>
                        <Label htmlFor="nature">Nature</Label>
                        <Input type="text" id="nature" name="nature" onChange={handleChange} error={!!errors.nature} success={!!formData.nature} />
                        {errors.nature && <p className="text-red-500 text-sm">{errors.nature}</p>}
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
