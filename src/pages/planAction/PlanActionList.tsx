import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import ProgressBar from "../../utils/ProgressBar";
import EditPlanActionStatus from "../../components/PlanAction/EditPlanActionStatut";
import EditPlanActionModel from "../../components/PlanAction/EditPlanActionModel";
import ModalPreview from "../../utils/ModelPreview";
import { Planaction } from "../../types/PlanAction";
import { PlanActionService } from "../../services/PlanActionService";
import { Column } from "../../types/Columns";

export default function PlanAction() {

    const [planaction, setPlanaction] = useState<Planaction[]>([]);
    const [selectedPlanAction, SetSelectedPlanAction] = useState<Planaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isUpdateStatutModelOpen, setIsUpdateStatutModelOpen] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [delet, setDelete] = useState(false);
    const [modif100, setmodif100] = useState(true);
    const [etat100, setetat100] = useState(true);
    const [user, setUser] = useState<any>(null);

    const getConnectedUserdata = () => {
        const userData = localStorage.getItem("userData");
        const storedUser = userData ? JSON.parse(userData) : null;
        console.log("Utilisateur trouvé :", storedUser);
        setUser(storedUser);
        return storedUser;
    };

    const fetchPlanActionData = async () => {
        try {
            let data;
            console.log('user here ' + user)
            if (user?.level === "Medium level") {
                data = await PlanActionService.getPlanActionMedium();
                console.log('medium level')
            } else {
                data = await PlanActionService.getPlanActionAdmin();
                console.log(data);
                console.log('high level')
            }
            setPlanaction(formatSources(data));
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getConnectedUserdata();
    }, []);

    useEffect(() => {
        if (user) {
            console.log("Utilisateur chargé :", user);
            fetchPlanActionData();
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") setDelete(true);
        if (user.role !== "user") {
            setmodif100(false);
            setetat100(false);
        }
    }, [user]);

    const formatSources = (data: Planaction[]) => {
        return data.map(item => {
            const formatted = {
                ...item,
                id_dmpp: item.id_dmpp ? `DMPP N° ${item.id_dmpp}` : "",
                id_rapportnc: item.id_rapportnc ? `Non-conformité N° ${item.id_rapportnc}` : "",
                id_scrap: item.id_scrap ? `Scrap N° ${item.id_scrap}` : "",
                id_suiviclient: item.id_suiviclient ? `Réclamation client N° ${item.id_suiviclient}` : "",
                id_suivifournisseur: item.id_suivifournisseur ? `Suivi fournisseur N° ${item.id_suivifournisseur}` : "",
                id_supercontrole: item.id_supercontrole ? `Super contrôle N° ${item.id_supercontrole}` : "",
            };

            const hasNoSource =
                !item.id_dmpp &&
                !item.id_scrap &&
                !item.id_rapportnc &&
                !item.id_suiviclient &&
                !item.id_suivifournisseur &&
                !item.id_supercontrole;

            return {
                ...formatted,
                source_label: hasNoSource ? "Plan d’action locale" : "",
            };
        });
    };

    //delete plan action 
    const handleDelete = async (id_planaction: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await PlanActionService.deletePlanAction(id_planaction);
            setPlanaction((prev) => prev.filter((a) => a.id_planaction !== id_planaction));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };


    const handleEdit = (row: Planaction) => {
        SetSelectedPlanAction(row);
        setIsModalUpdateOpen(true);
    };

    const handleUpdateStatut = (row: Planaction) => {
        SetSelectedPlanAction(row);
        setIsUpdateStatutModelOpen(true);
    };

    const handleSaveUpdateStatus = async (updated: { id_planaction: number; status: string; progress: number }) => {
        try {
            if (!updated || !updated.id_planaction || !updated.status) {
                console.warn(" Données invalides, requête non envoyée :", updated);
                return;
            }

            console.log(" Requête envoyée :", updated);

            await PlanActionService.updatestatus(updated.id_planaction, updated.status, updated.progress);

            setPlanaction((prev) =>
                prev.map((p) =>
                    p.id_planaction === updated.id_planaction
                        ? { ...p, status: updated.status, progress: updated.progress }
                        : p
                )
            );

            swal("Succès", "Statut mis à jour avec succès.", "success");
            SetSelectedPlanAction(null);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut :", err);
            swal("Erreur", "Impossible de mettre à jour le statut.", "error");
        }
    };


    const handleSave = (updatedPlanAction: Planaction) => {
        setPlanaction((prev) =>
            prev.map((r) => (r.id_planaction === updatedPlanAction.id_planaction ? updatedPlanAction : r))
        );
    };

    const getPlanActionOptions = (row: Planaction) => {
        const options = [];

        if (!modif100) {
            options.push({
                label: "Modifier",
                onClick: () => handleEdit(row),
            });
        }

        if (!delet) {
            options.push({
                label: "Supprimer",
                onClick: () => handleDelete(row.id_planaction),
            });
        }

        if (!etat100) {
            options.push({
                label: "Modifier Statut",
                onClick: () => handleUpdateStatut(row),
            });
        }

        return options;
    };

    const [filters, setFilters] = useState<Record<string, string>>({
        zone: "",
        origine: "",
        date_cloture: "",
        support: "",
        last_name: "",
        departement: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "zone", placeholder: "Zone" },
        { name: "origine", placeholder: "Origine" },
        { name: "date_cloture", placeholder: "Date de cloture" },
        { name: "support", placeholder: "Suppport" },
        { name: "first_name", placeholder: "Responsable" },
        { name: "departement", placeholder: "Departement" },
    ];

    // Fonction pour filtrer les rapports
    const filteredRegsitrScrap = planaction.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const fieldValue = String(r[key as keyof Planaction] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<Planaction>[] = [
        {
            name: "Source",
            cell: (row: any) => (
                <span>
                    {row.id_rapportnc ||
                        row.id_scrap ||
                        row.id_dmpp ||
                        row.id_suiviclient ||
                        row.id_suivifournisseur ||
                        row.id_supercontrole ||
                        row.source_label}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Statut',
            cell: (row) => {
                let badgeClass = "bg-gray-300 text-gray-800";
                if (row.status === "open") badgeClass = "bg-gray-300 text-white";
                if (row.status === "in progress") badgeClass = "bg-orange-300 text-white";
                if (row.status === "done") badgeClass = "badge bg-green-300 text-white";
                if (row.status === "canceld") badgeClass = "badge bg-red-300 text-white";

                return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{row.status}</span>;
            },
            sortable: true

        },
        {
            name: "Progresse",
            cell: (row) => {
                return <ProgressBar progress={row.progress} />;
            },
            sortable: false
        },
        { name: "Departement", selector: (row) => row.nom_departement, sortable: true },
        { name: "Zone", selector: (row) => row.zone, sortable: true },
        { name: "Origine", selector: (row) => row.origine, sortable: true },
        { name: "Probléme", selector: (row) => row.prob, sortable: true },
        {
            name: "Cause",
            cell: (row) => (
                <ModalPreview
                    label={row.cause}
                    title="Cause Détaillée"
                    content={row.cause}
                    maxLength={20}
                />
            ),
        },
        {
            name: "Action",
            cell: (row) => (
                <ModalPreview
                    label={row.action}
                    title="Action Détaillée"
                    content={row.action}
                    maxLength={20}
                />
            ),
        },
        {
            name: "Date de début",
            selector: (row) => row.date_debut ? new Date(row.date_debut).toLocaleDateString() : "—",
            sortable: true
        },
        {
            name: "Date de cloture",
            selector: (row) => row.date_cloture ? new Date(row.date_cloture).toLocaleDateString() : "—",
            sortable: true
        },
        {
            name: " NOTE(date de retardement ou docs Utilisés pour controle Efficacité ) ",
            cell: (row) => (
                <ModalPreview
                    label={row.note}
                    title=" NOTE(date de retardement ou docs Utilisés pour controle Efficacité ) "
                    content={row.note}
                    maxLength={20}
                />
            ),
        },
        { name: "Responsable", selector: (row) => row.first_name || "" + ' ' + row.last_name || "", sortable: true },
        { name: "Support", selector: (row) => row.support, sortable: true },
        { name: "Controle d efficacité ", selector: (row) => row.contol_effic, sortable: true },
        {
            name: "Annulation",
            cell: (row) => {
                let badgeColor = "bg-gray-300 text-gray-800";

                switch (row.annul.toLowerCase()) {
                    case "oui":
                        badgeColor = "bg-red-100 text-red-800";
                        break;
                    case "non":
                        badgeColor = "bg-green-100 text-green-800";
                        break;
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {row.annul}
                    </span>
                );
            },
            sortable: true,
        },
        {
            name: "Actions",
            hidden:etat100,
            cell: (row) => <ActionMenu options={getPlanActionOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Plan d'action" description="gestion des plan d'actions" />
            <PageBreadcrumb pageTitle="Plan d'action" />
            <button
                onClick={() => navigate("/plan-action/add-plan-action")}
                hidden={etat100}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Plan d'action
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des plans d'actions"
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredRegsitrScrap}
                    loading={loading}
                    error={error}
                />
            </div>

            <EditPlanActionModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                planAction={selectedPlanAction}
                onSave={handleSave}
            />

            <EditPlanActionStatus
                isOpen={isUpdateStatutModelOpen}
                onClose={() => setIsUpdateStatutModelOpen(false)}
                planAction={selectedPlanAction}
                onSave={handleSaveUpdateStatus}
            />
        </>
    );
}
