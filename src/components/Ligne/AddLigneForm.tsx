import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import DatePicker from "../form/date-picker.tsx";
import GoBackButton from "../../utils/GoBack.tsx";
import { useEffect, useState } from "react";
import { LigneService } from "../../services/LigneService.tsx";
import { Departement } from "../../types/Departement.tsx";
import { DepartementService } from "../../services/DepartementService.tsx";
import { UserService } from "../../services/UserService.tsx";
import { Utilisateur } from "../../types/Utilisateur.ts";



export default function AddLigneForm() {
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [user, setUser] = useState<Utilisateur[]>([]);
    const [departementError, setDepartementError] = useState<any>({});
    const [formData, setFormData] = useState<any>({
        id_ligne: "",
        nom_ligne: "",
        ref: "",
        departement: "",
        cap_production: "",
        responsable: "",
        Date_maintenance: "",
        proch_entretien: "",
        status: "",
    });


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
        fetchDepartements();
        fetchUsers();
    }, []);


    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
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

        if (!formData.nom_ligne) newErrors.nom_ligne = "Le nom du ligne est requis";
        if (!formData.ref) newErrors.ref = "La référence est requise";
        if (!formData.departement) newErrors.departement = "Le departement est requis";
        if (!formData.cap_production) newErrors.cap_production = "La capacité de production est requise";
        if (!formData.responsable) newErrors.responsable = "Le nom de responsable est requis";
        if (!formData.Date_maintenance) newErrors.Date_maintenance = "La date de maintenance est requise";
        if (!formData.proch_entretien) newErrors.proch_entretien = "La date de prochaine maintenance est requise";
        if (!formData.status) newErrors.status = "Le statut est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLigne = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log("📤 Données envoyées :", formData);

            const res = await LigneService.createLigne(formData);

            swal({
                title: "Succès !",
                text: "Le Ligne été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/lignes";
            });
        } catch (err) {
            console.error("Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <PageMeta
                    title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                    description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                />
                <div className="flex items-center justify-between mb-1">
                    <GoBackButton />
                    <PageBreadcrumb pageTitle="" />
                </div>
                <ComponentCard title="Ajouter une Ligne">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="nom_ligne">Nom du Ligne</Label>
                            <Input type="text" id="nom_ligne"
                                onChange={handleChange}
                                error={!!errors.nom_ligne}
                                success={!!formData.nom_ligne}
                            />
                            {errors.nom_ligne && <p className="text-red-500 text-sm">{errors.nom_ligne}</p>}
                        </div>
                        <div>
                            <Label htmlFor="inpureftrefTwo">Reference de Ligne</Label>
                            <Input type="text" id="ref" placeholder=""
                                onChange={handleChange}
                                error={!!errors.ref}
                                success={!!formData.ref}
                            />
                            {errors.ref && <p className="text-red-500 text-sm">{errors.ref}</p>}

                        </div>

                        <div>
                            <Label>Departement</Label>
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
                            <Label htmlFor="cap_production">Capacité de production</Label>
                            <Input type="number" id="cap_production" placeholder="000.00"
                                onChange={handleChange}
                                error={!!errors.cap_production}
                                success={!!formData.cap_production}
                            />
                            {errors.cap_production && <p className="text-red-500 text-sm">{errors.cap_production}</p>}
                        </div>

                        <div>
                            <Label htmlFor="responsable">Responsable de Ligne</Label>
                            <Select
                                options={user.length > 0
                                    ? user.map(user => ({ value: String(user.id_user), label: user.first_name }))
                                    : [{ value: "", label: "Aucun utilisateur disponible" }]
                                }
                                placeholder={loading ? "Chargement..." : "Sélectionner"}
                                onChange={(val) => handleSelectChange(val, "responsable")}
                            />
                            {errors.responsable && <p className="text-red-500 text-sm">{errors.responsable}</p>}
                        </div>
                        <div>
                            <DatePicker
                                id="Date_maintenance"
                                label="Date de dernier maintenance"
                                placeholder="Sélectionner une date"
                                onChange={(dates) => {
                                    const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        Date_maintenance: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                    }));
                                }}
                            />
                            {errors.Date_maintenance && <p className="text-red-500 text-sm">{errors.Date_maintenance}</p>}
                        </div>
                        <div>
                            <DatePicker
                                id="proch_entretien"
                                label="Date de prochaine maintenance"
                                placeholder="Sélectionner une date"
                                onChange={(dates) => {
                                    const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        proch_entretien: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                    }));
                                }}
                            />
                            {errors.proch_entretien && <p className="text-red-500 text-sm">{errors.proch_entretien}</p>}
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                options={options}
                                placeholder="Select an option"
                                onChange={(val) => handleSelectChange(val, "status")}
                                className="dark:bg-dark-900"
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                        <button
                            type="button"
                            onClick={handleLigne}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                        </button>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
