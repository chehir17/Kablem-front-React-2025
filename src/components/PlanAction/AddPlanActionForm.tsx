import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import { useNavigate, useParams } from "react-router-dom";
import { Departement } from "../../types/Departement";
import { UserService } from "../../services/UserService";
import { Utilisateur } from "../../types/Utilisateur";
import { DepartementService } from "../../services/DepartementService";
import { PlanActionService } from "../../services/PlanActionService";
import { validateForm } from "./Validation";


export default function AddPlanActionForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>({
        nom_departement: "",
        zone: "",
        origine: "",
        prob: "",
        cause: "",
        support: "",
        date_debut: "",
        date_cloture: "",
        status: "open",
        action: "",
        responsable: "",
        editeur: "",
        contol_effic: "",
        progress: 0,
        annul: "",
        level: "",
        note: "",
        id_scrap: "",
        id_rapportnc: "",
        id_dmpp: "",
        id_supercontrole: "",
        id_suiviclient: "",
        id_suivifournisseur: "",
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [user, setUser] = useState<Utilisateur[]>([]);
    const [AdminPermission, setAdminPermission] = useState(false);
    const [departementError, setDepartementError] = useState<any>({});
    const { id, type } = useParams();
    const [planData, setPlanData] = useState({
        id_rapportnc: "",
        id_scrap: "",
        id_dmpp: "",
        id_supercontrole: "",
        id_suiviclient: "",
        id_suivifournisseur: "",
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
        const userData = localStorage.getItem("userData");
        const storedUser = userData ? JSON.parse(userData) : null;

        console.log("👤 Utilisateur connecté :", storedUser);

        if (storedUser) {
            // Remplir le champ 'editeur' pour tous
            setFormData((prev: any) => ({
                ...prev,
                editeur: `${storedUser.first_name} ${storedUser.last_name}`,
            }));

            // Déterminer les permissions admin
            if (storedUser.level !== "High level") {
                setAdminPermission(true);
            } else {
                setAdminPermission(false);
            }
        }

        const newData: any = {};
        switch (type) {
            case "nc":
                newData.id_rapportnc = id;
                break;
            case "dmpp":
                newData.id_dmpp = id;
                break;
            case "suiviclient":
                newData.id_suiviclient = id;
                break;
            case "suivifournisseur":
                newData.id_suivifournisseur = id;
                break;
            case "scrap":
                newData.id_scrap = id;
                break;
            case "super":
                newData.id_supercontrole = id;
                break;
            default:
                break;
        }
        setPlanData((prev) => ({ ...prev, ...newData }));

        fetchDepartements();
        fetchUsers();


        if (!storedUser || !storedUser.id_user) {
            swal({
                title: "Erreur utilisateur",
                text: "Impossible d'identifier l'utilisateur connecté.",
                icon: "error",
            });
            return;
        }
    }, [id, type]);

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

    const annul = [
        { value: "oui", label: "Oui" },
        { value: "non", label: "Non" },
    ];

    const level = [
        { value: "High Level", label: "High Level" },
        { value: "Medium Level", label: "Medium Level" },
    ];

    const zone = [
        { value: "P1", label: "P1" },
        { value: "P2", label: "P2" },
        { value: "P3", label: "P3" },
        { value: "P1 + P2", label: "P1 + P2" },
        { value: "P1 + P2 + P3", label: "P1 + P2 + P3" },
        { value: "CET", label: "CET" },
        { value: "Magasin", label: "Magasin" },
        { value: "P3-1", label: "P3-1" },
        { value: "P3-2", label: "P3-2" },
        { value: "P3-3", label: "P3-3" },
        { value: "Usine", label: "Usine" },
    ];



    const origine = [
        { value: "Audit interne", label: "Audit interne" },
        { value: "réunion usine", label: "réunion usine" },
        { value: "réunion Zone", label: "réunion Zone" },
        { value: "réunion Protos", label: "réunion Protos" },
        { value: "Audit externe", label: "Audit externe" },
        { value: "Audit interne CET", label: "Audit interne CET" },
        { value: "Audit interne Ducato 01/12", label: "Audit interne Ducato 01/12" },
        { value: "Audit interne Magneti Marelli  22/09", label: "Audit interne Magneti Marelli  22/09" },
        { value: "Audit SGS Stage 1", label: "Audit SGS Stage 1" },
        { value: "Audit SGS Stage 2", label: "Audit SGS Stage 2" },

    ];


    const handleAddPlanAction = async () => {
        const isValid = validateForm(formData, setErrors);
        if (!isValid) return;
        setLoading(true);
        try {
            // fusionner formData + planData
            const fullData = { ...formData, ...planData };

            console.log("📤 Données envoyées :", fullData);

            const res = await PlanActionService.createPlanAction(fullData);
            setLoading(false);
            swal({
                title: "Succès !",
                text: "Le plan d’action a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                navigate("/plan-action");
            });
        } catch (err) {
            setLoading(false);
            console.error("❌ Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        }
    };

    return (

        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Plan d'action">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Departement</Label>
                        <Select
                            options={departements.length > 0
                                ? departements.map(dep => ({ value: String(dep.id_departement), label: dep.nom_departement }))
                                : [{ value: "", label: "Aucun département disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "nom_departement")}
                        />
                        {errors.nom_departement && <p className="text-red-500 text-sm">{errors.nom_departement}</p>}
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Select
                            options={zone}
                            placeholder="Sélectionner une Zone"
                            onChange={(val) => handleSelectChange(val, "zone")}
                        />
                        {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                    </div>
                    <div>
                        <Label htmlFor="origine">Origine</Label>
                        <Select
                            options={origine}
                            placeholder="Sélectionner Origine"
                            onChange={(val) => handleSelectChange(val, "origine")}
                        />
                        {errors.origine && <p className="text-red-500 text-sm">{errors.origine}</p>}
                    </div>
                    <div>
                        <Label htmlFor="prob">Problémes</Label>
                        <Input
                            type="text"
                            id="prob"
                            name="prob"
                            onChange={handleChange}
                        />
                        {errors.prob && <p className="text-red-500 text-sm">{errors.prob}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cause">Cause</Label>
                        <Input
                            type="text"
                            id="cause"
                            name="cause"
                            onChange={handleChange}
                            error={!!errors.cause}
                            success={!!formData.cause}
                        />
                        {errors.cause && <p className="text-red-500 text-sm">{errors.cause}</p>}
                    </div>
                    <div>
                        <Label htmlFor="action">Actions</Label>
                        <Input
                            type="text"
                            id="action"
                            name="action"
                            onChange={handleChange}
                            error={!!errors.action}
                            success={!!formData.action}
                        />
                        {errors.action && <p className="text-red-500 text-sm">{errors.action}</p>}
                    </div>
                    <div>
                        <DatePicker
                            id="date_debut"
                            label="Date de début"
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    date_debut: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
                            }}
                        />
                        {errors.date_debut && <p className="text-red-500 text-sm">{errors.date_debut}</p>}
                    </div>
                    <div>
                        <DatePicker
                            id="date_cloture"
                            label="Date de clôture"
                            placeholder="Sélectionner une date"
                            onChange={(dates) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    date_cloture: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                }));
                            }}
                        />
                        {errors.date_cloture && <p className="text-red-500 text-sm">{errors.date_cloture}</p>}
                    </div>
                    <div>
                        <Label>Responsable</Label>
                        <Select
                            options={user.length > 0
                                ? user.map(user => ({ value: String(user.id_user), label: user.first_name + ' ' + user.last_name }))
                                : [{ value: "", label: "Aucun utilisateur disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "responsable")}
                        />
                        {errors.responsable && <p className="text-red-500 text-sm">{errors.responsable}</p>}
                    </div>
                    <div>
                        <Label htmlFor="support">Support</Label>
                        <Input
                            type="text"
                            id="support"
                            name="support"
                            onChange={handleChange}
                            error={!!errors.support}
                            success={!!formData.support}
                        />
                        {errors.support && <p className="text-red-500 text-sm">{errors.support}</p>}
                    </div>
                    <div>
                        <Label>Controle d'efficacité</Label>
                        <Input
                            type="text"
                            id="contol_effic"
                            name="contol_effic"
                            onChange={handleChange}
                            error={!!errors.contol_effic}
                            success={!!formData.contol_effic}
                        />
                        {errors.contol_effic && <p className="text-red-500 text-sm">{errors.contol_effic}</p>}
                    </div>
                    <div className="mb-5">
                        <Label>Note(date de retardement ou docs Utilisés pour controle Efficacité )</Label>
                        <Input
                            type="text"
                            id="note"
                            name="note"
                            onChange={handleChange}
                            error={!!errors.note}
                            success={!!formData.note}
                        />
                        {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
                    </div>
                    <div>
                        <Label>Annulation</Label>
                        <Select
                            options={annul}
                            placeholder="Sélectionner un code"
                            onChange={(val) => handleSelectChange(val, "annul")}
                        />
                        {errors.annul && <p className="text-red-500 text-sm">{errors.annul}</p>}
                    </div>
                    {!AdminPermission && (
                        <div>
                            <Label>Niveau</Label>
                            <Select
                                options={level}
                                placeholder="Sélectionner un niveau"
                                onChange={(val) => handleSelectChange(val, "level")}
                            />
                            {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        type="button"
                        onClick={handleAddPlanAction}
                        className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}