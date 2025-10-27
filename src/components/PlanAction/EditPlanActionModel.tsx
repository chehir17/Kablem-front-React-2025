import { useState, useEffect } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import { Planaction } from "../../types/PlanAction";
import { Departement } from "../../types/Departement";
import { Utilisateur } from "../../types/Utilisateur";
import { UserService } from "../../services/UserService";
import { DepartementService } from "../../services/DepartementService";
import { useNavigate, useParams } from "react-router";
import { PlanActionService } from "../../services/PlanActionService";

interface EditPlanActionModelProps {
    isOpen: boolean;
    onClose: () => void;
    planAction: Planaction | null;
    onSave: (updatedPalnActions: Planaction) => void;
}

export default function EditPlanActionModel({
    isOpen,
    onClose,
    planAction,
    onSave,
}: EditPlanActionModelProps) {
    const [formData, setFormData] = useState({
        id_planaction: 0,
        created_at: "",
        id_dmpp: null as string | null,
        id_rapportnc: null as string | null,
        id_scrap: null as string | null,
        id_suiviclient: null as string | null,
        id_suivifournisseur: null as string | null,
        id_supercontrole: null as string | null,
        status: "open",
        progress: 0,
        nom_departement: "",
        zone: "",
        origine: "",
        prob: "",
        cause: "",
        action: "",
        date_debut: new Date(),
        date_cloture: new Date(),
        note: "",
        responsable: "",
        support: "",
        contol_effic: "",
        annul: "",
        level: "",
    });

    useEffect(() => {
        if (planAction) {
            setFormData({
                id_planaction: planAction.id_planaction,
                created_at: planAction.created_at || "",
                id_dmpp: planAction.id_dmpp || null,
                id_rapportnc: planAction.id_rapportnc || null,
                id_scrap: planAction.id_scrap || null,
                id_suiviclient: planAction.id_suiviclient || null,
                id_suivifournisseur: planAction.id_suivifournisseur || null,
                id_supercontrole: planAction.id_supercontrole || null,
                status: planAction.status || "open",
                progress: planAction.progress || 0,
                nom_departement: planAction.nom_departement || "",
                zone: planAction.zone || "",
                origine: planAction.origine || "",
                prob: planAction.prob || "",
                cause: planAction.cause || "",
                action: planAction.action || "",
                date_debut: planAction.date_debut
                    ? new Date(planAction.date_debut)
                    : new Date(),
                date_cloture: planAction.date_cloture
                    ? new Date(planAction.date_cloture)
                    : new Date(),
                note: planAction.note || "",
                responsable: planAction.responsable || "",
                support: planAction.support || "",
                contol_effic: planAction.contol_effic || "",
                annul: planAction.annul || "",
                level: planAction.level || "",
            });
        }
    }, [planAction]);

    const navigate = useNavigate();
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [user, setUser] = useState<Utilisateur[]>([]);
    const [AdminPermission, setAdminPermission] = useState(false);
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
            console.log("Impossible de charger les départements.");
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
            console.log("Impossible de charger les utilisateurs.");
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
    }, [id, type]);

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdatePlanAction = async () => {
        try {

            const fullData = { ...formData, ...planData };

            console.log("📤 Données envoyées :", fullData);

            const res = await PlanActionService.updateplanAction(planAction!.id_planaction, fullData);

            swal({
                title: "Succès !",
                text: "Le plan d’action a été ajour avec success.",
                icon: "success",
            }).then(() => {
                navigate("/plan-action");
            });
        } catch (err) {
            console.error("❌ Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        }
    };

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

    const level = [
        { value: "High Level", label: "High Level" },
        { value: "Medium Level", label: "Medium Level" },
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

    const annul = [
        { value: "oui", label: "Oui" },
        { value: "non", label: "Non" },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-50">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {planAction ? `Modifier le Plan d'action N° ${planAction.id_planaction}` : "Modifier"}
                </h4>

                <form className="flex flex-col" onSubmit={handleUpdatePlanAction}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mr-5">

                            <div>
                                <Label>Departement</Label>
                                <Select
                                    options={departements.length > 0
                                        ? departements.map(dep => ({ value: String(dep.id_departement), label: dep.nom_departement }))
                                        : [{ value: "", label: "Aucun département disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange("nom_departement", val)}
                                    value={formData.nom_departement}
                                />
                                {errors.nom_departement && <p className="text-red-500 text-sm">{errors.nom_departement}</p>}
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Select
                                    options={zone}
                                    placeholder="Sélectionner une Zone"
                                    onChange={(val) => handleSelectChange(val, "zone")}
                                    value={formData.zone}
                                />
                                {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                            </div>
                            <div>
                                <Label htmlFor="origine">Origine</Label>
                                <Select
                                    options={origine}
                                    placeholder="Sélectionner Origine"
                                    onChange={(val) => handleSelectChange(val, "origine")}
                                    value={formData.origine}
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
                                    value={formData.prob}
                                    error={!!errors.prob}
                                    success={!!formData.prob}
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
                                    value={formData.cause}
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
                                    value={formData.action}
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
                                    value={formData.responsable}
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
                                    value={formData.support}
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
                                    value={formData.contol_effic}
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
                                    value={formData.note}
                                />
                                {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
                            </div>
                            <div>
                                <Label>Annulation</Label>
                                <Select
                                    options={annul}
                                    placeholder="Sélectionner un code"
                                    onChange={(val) => handleSelectChange(val, "annul")}
                                    value={formData.annul}
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
                                        value={formData.level}
                                    />
                                    {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdatePlanAction}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

