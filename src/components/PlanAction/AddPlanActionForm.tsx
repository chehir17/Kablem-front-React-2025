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


export default function AddPlanActionForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>({
        id_departement: "",
        zone: "",
        origine: "",
        prob: "",
        cause: "",
        support: "",
        date_debut: "",
        date_cloture: "",
        status: "",
        action: "",
        responsable: "",
        editeur: "",
        contol_effic: "",
        progress: "",
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
    const { id, type } = useParams(); // ✅ récupère depuis l’URL
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

        // ✅ définit la source en fonction du type
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

        //fetch departemnts:
        fetchDepartements();
        //fetch users
        fetchUsers();
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

    const status = [
        { value: "open", label: "Open" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
        { value: "canceld", label: "Canceld" },
    ];

    const level = [
        { value: "High_level", label: "High Level" },
        { value: "medium_level", label: "Medium Level" },
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
        try {
            // fusionner formData + planData
            const fullData = { ...formData, ...planData };

            console.log("📤 Données envoyées :", fullData);

            const res = await PlanActionService.createPlanAction(fullData);

            swal({
                title: "Succès !",
                text: "Le plan d’action a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                navigate("/plan-action");
            });
        } catch (err) {
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
                        <Label>statut</Label>
                        <Select
                            options={status}
                            placeholder="Sélectionner une statut"
                            onChange={(val) => handleSelectChange(val, "status")}
                        />
                    </div>
                    <div>
                        <Label>Departement</Label>
                        <Select
                            options={departements.length > 0
                                ? departements.map(dep => ({ value: String(dep.id_departement), label: dep.nom_departement }))
                                : [{ value: "", label: "Aucun département disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "id_departement")}
                        />
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Select
                            options={zone}
                            placeholder="Sélectionner une Zone"
                            onChange={(val) => handleSelectChange(val, "zone")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="origine">Origine</Label>
                        <Select
                            options={origine}
                            placeholder="Sélectionner Origine"
                            onChange={(val) => handleSelectChange(val, "origine")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="prob">Problémes</Label>
                        <Input
                            type="text"
                            id="prob"
                            name="prob"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cause">Cause</Label>
                        <Input
                            type="text"
                            id="cause"
                            name="cause"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="action">Actions</Label>
                        <Input
                            type="text"
                            id="action"
                            name="action"
                            onChange={handleChange}
                        />
                    </div>
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

                    <div>
                        <Label>Responsable</Label>
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
                        <Label htmlFor="support">Support</Label>
                        <Input
                            type="text"
                            id="support"
                            name="support"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Controle d'efficacité</Label>
                        <Input
                            type="text"
                            id="contol_effic"
                            name="contol_effic"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-5">
                        <Label>Note(date de retardement ou docs Utilisés pour controle Efficacité )</Label>
                        <Input
                            type="text"
                            id="note"
                            name="note"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Annulation</Label>
                        <Select
                            options={annul}
                            placeholder="Sélectionner un code"
                            onChange={(val) => handleSelectChange(val, "annul")}
                        />
                    </div>
                    {!AdminPermission && (
                        <div>
                            <Label>Niveau</Label>
                            <Select
                                options={level}
                                placeholder="Sélectionner un niveau"
                                onChange={(val) => handleSelectChange(val, "level")}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={handleAddPlanAction}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter plan d'action
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}