import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditRegisterSCRAPModel from "../../components/RegisterSCARP/EditRegisterSCRAPModel";
import ProgressBar from "../../utils/ProgressBar";
import EditPlanActionStatus from "../../components/PlanAction/EditPlanActionStatut";
import EditPlanActionModel from "../../components/PlanAction/EditPlanActionModel";
import ModalPreview from "../../utils/ModelPreview";

export default function PlanAction() {

    interface PlanAction {
        id_planaction: number;
        created_at: string;
        id_dmpp: string | null;
        id_rapportnc: string | null;
        id_scrap: string | null;
        id_suiviclient: string | null;
        id_suivifournisseur: string | null;
        id_supercontrole: string | null;
        status: string;
        progress: number;
        departement: string;
        zone: string;
        origine: string;
        prob: string;
        cause: string;
        action: string;
        date_debut: Date;
        date_cloture: Date;
        note: string;
        first_name: string;
        last_name: string;
        support: string;
        contol_effic: string;
        annul: string;
        level: string;
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }

    const [planaction, setPlanaction] = useState<PlanAction[]>([
        {
            id_planaction: 1,
            created_at: "2025-01-20",
            id_dmpp: "",
            id_rapportnc: null,
            id_scrap: "Scrap N° 5",
            id_suiviclient: null,
            id_suivifournisseur: null,
            id_supercontrole: null,
            status: "in progress",
            progress: 70,
            departement: "Qualité",
            zone: "Zone A",
            origine: "Machine X12",
            prob: "Défaut de soudure détecté sur la ligne de production.",
            cause: "Usure de l’outil de soudage non remplacé à temps.",
            action: "Remplacer l’outil et mettre en place un suivi préventif.",
            date_debut: new Date("2025-01-22"),
            date_cloture: new Date("2025-02-05"),
            note: "Contrôle final planifié avec rapport ISO.",
            first_name: "Ali",
            last_name: "Ben Salah",
            support: "Fournisseur externe",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 2,
            created_at: "2025-01-25",
            id_dmpp: "",
            id_rapportnc: "Non-conformité N° 7",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: "",
            status: "open",
            progress: 20,
            departement: "Production",
            zone: "Zone C",
            origine: "Réglage opérateur",
            prob: "Produit non conforme à la commande client.",
            cause: "Erreur de réglage machine par l’opérateur.",
            action: "Former l’opérateur + checklist avant démarrage.",
            date_debut: new Date("2025-01-28"),
            date_cloture: new Date("2025-02-05"),
            note: "À surveiller avec le responsable de ligne.",
            first_name: "Sana",
            last_name: "Trabelsi",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "meduim level"
        },
        {
            id_planaction: 3,
            created_at: "2025-02-01",
            id_dmpp: "DMPP-12",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "in progress",
            progress: 50,
            departement: "Maintenance",
            zone: "Zone B",
            origine: "Machine Y34",
            prob: "Vibrations anormales détectées.",
            cause: "Roulements usés.",
            action: "Remplacer les roulements et vérifier alignement.",
            date_debut: new Date("2025-02-03"),
            date_cloture: new Date("2025-02-15"),
            note: "Inspection complémentaire après intervention.",
            first_name: "Khaled",
            last_name: "Haddad",
            support: "Interne",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 4,
            created_at: "2025-02-04",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "Suivi Client N° 2",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "open",
            progress: 10,
            departement: "Qualité",
            zone: "Zone D",
            origine: "Contrôle final",
            prob: "Emballage endommagé constaté par le client.",
            cause: "Stockage incorrect dans l'entrepôt.",
            action: "Revoir procédure de stockage + formation équipe logistique.",
            date_debut: new Date("2025-02-05"),
            date_cloture: new Date("2025-02-20"),
            note: "Suivi avec le client programmé.",
            first_name: "Nadia",
            last_name: "Ben Amor",
            support: "Externe",
            contol_effic: "Non",
            annul: "Non",
            level: "medium level"
        },
        {
            id_planaction: 5,
            created_at: "2025-02-07",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 7",
            id_suiviclient: null,
            id_suivifournisseur: null,
            id_supercontrole: "",
            status: "closed",
            progress: 100,
            departement: "Production",
            zone: "Zone A",
            origine: "Ligne automatique",
            prob: "Surchauffe du moteur détectée.",
            cause: "Filtres de ventilation obstrués.",
            action: "Nettoyer filtres et planifier maintenance régulière.",
            date_debut: new Date("2025-02-08"),
            date_cloture: new Date("2025-02-12"),
            note: "Moteur testé et conforme après nettoyage.",
            first_name: "Omar",
            last_name: "Chebbi",
            support: "Interne",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 6,
            created_at: "2025-02-10",
            id_dmpp: "DMPP-13",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "in progress",
            progress: 60,
            departement: "Maintenance",
            zone: "Zone C",
            origine: "Machine Z45",
            prob: "Fuite hydraulique sur cylindre.",
            cause: "Joint usé.",
            action: "Remplacer joint et tester pression.",
            date_debut: new Date("2025-02-11"),
            date_cloture: new Date("2025-02-18"),
            note: "Contrôle prévu après intervention.",
            first_name: "Fatma",
            last_name: "Gharbi",
            support: "Externe",
            contol_effic: "Non",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 7,
            created_at: "2025-02-12",
            id_dmpp: "",
            id_rapportnc: "Non-conformité N° 9",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "open",
            progress: 15,
            departement: "Qualité",
            zone: "Zone B",
            origine: "Inspection produit",
            prob: "Étiquette manquante sur produit.",
            cause: "Erreur d'impression d'étiquette.",
            action: "Réimprimer étiquettes et former l'opérateur.",
            date_debut: new Date("2025-02-13"),
            date_cloture: new Date("2025-02-25"),
            note: "À vérifier lors du prochain lot.",
            first_name: "Mohamed",
            last_name: "Bensaid",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "medium level"
        },
        {
            id_planaction: 8,
            created_at: "2025-02-15",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 8",
            id_suiviclient: "",
            id_suivifournisseur: null,
            id_supercontrole: "",
            status: "in progress",
            progress: 80,
            departement: "Production",
            zone: "Zone D",
            origine: "Machine X22",
            prob: "Arrêt intempestif de la ligne.",
            cause: "Capteur défectueux.",
            action: "Remplacer capteur + tester fonctionnement.",
            date_debut: new Date("2025-02-16"),
            date_cloture: new Date("2025-02-28"),
            note: "Ligne relancée et suivie.",
            first_name: "Amine",
            last_name: "Khlifi",
            support: "Interne",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 9,
            created_at: "2025-02-18",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "Suivi Client N° 3",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "open",
            progress: 30,
            departement: "Qualité",
            zone: "Zone A",
            origine: "Contrôle interne",
            prob: "Contamination croisée détectée.",
            cause: "Nettoyage insuffisant des machines.",
            action: "Mettre en place protocole de nettoyage strict.",
            date_debut: new Date("2025-02-19"),
            date_cloture: new Date("2025-03-05"),
            note: "Surveillance renforcée requise.",
            first_name: "Leila",
            last_name: "Ben Youssef",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 10,
            created_at: "2025-02-20",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 9",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "closed",
            progress: 100,
            departement: "Maintenance",
            zone: "Zone C",
            origine: "Machine Y11",
            prob: "Panne électrique détectée.",
            cause: "Câble endommagé.",
            action: "Remplacer câble et tester alimentation.",
            date_debut: new Date("2025-02-21"),
            date_cloture: new Date("2025-02-25"),
            note: "Machine testée et opérationnelle.",
            first_name: "Houssem",
            last_name: "Jemai",
            support: "Externe",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 11,
            created_at: "2025-02-22",
            id_dmpp: "DMPP-15",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "in progress",
            progress: 40,
            departement: "Production",
            zone: "Zone D",
            origine: "Réglage opérateur",
            prob: "Variation de poids des produits.",
            cause: "Paramètres machine incorrects.",
            action: "Ajuster paramètres et recalibrer.",
            date_debut: new Date("2025-02-23"),
            date_cloture: new Date("2025-03-10"),
            note: "Suivi quotidien nécessaire.",
            first_name: "Rym",
            last_name: "Toumi",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "medium level"
        },
        {
            id_planaction: 12,
            created_at: "2025-02-25",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 10",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: "",
            status: "open",
            progress: 25,
            departement: "Qualité",
            zone: "Zone B",
            origine: "Inspection visuelle",
            prob: "Fissure détectée sur produit final.",
            cause: "Matière première défectueuse.",
            action: "Isoler lot et informer fournisseur.",
            date_debut: new Date("2025-02-26"),
            date_cloture: new Date("2025-03-15"),
            note: "Contrôle renforcé sur lots suivants.",
            first_name: "Sami",
            last_name: "Bouraoui",
            support: "Externe",
            contol_effic: "Non",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 13,
            created_at: "2025-02-28",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 11",
            id_suiviclient: "",
            id_suivifournisseur: null,
            id_supercontrole: null,
            status: "in progress",
            progress: 55,
            departement: "Maintenance",
            zone: "Zone A",
            origine: "Machine X30",
            prob: "Surconsommation d’énergie détectée.",
            cause: "Mauvais réglage moteur.",
            action: "Optimiser réglages + suivi consommation.",
            date_debut: new Date("2025-03-01"),
            date_cloture: new Date("2025-03-12"),
            note: "Analyse énergétique planifiée.",
            first_name: "Imen",
            last_name: "Zouari",
            support: "Interne",
            contol_effic: "Oui",
            annul: "Non",
            level: "medium level"
        },
        {
            id_planaction: 14,
            created_at: "2025-03-02",
            id_dmpp: "DMPP-16",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "open",
            progress: 5,
            departement: "Qualité",
            zone: "Zone C",
            origine: "Test produit",
            prob: "Non-conformité détectée lors du contrôle.",
            cause: "Erreur humaine lors de l’assemblage.",
            action: "Former opérateur + vérifier lignes.",
            date_debut: new Date("2025-03-03"),
            date_cloture: new Date("2025-03-20"),
            note: "À recontrôler après formation.",
            first_name: "Salma",
            last_name: "Masmoudi",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "medium level"
        },
        {
            id_planaction: 15,
            created_at: "2025-03-05",
            id_dmpp: "",
            id_rapportnc: "",
            id_scrap: "Scrap N° 12",
            id_suiviclient: "",
            id_suivifournisseur: null,
            id_supercontrole: "",
            status: "in progress",
            progress: 65,
            departement: "Production",
            zone: "Zone D",
            origine: "Machine Y50",
            prob: "Erreur dimensionnelle détectée.",
            cause: "Usure de l’outil de coupe.",
            action: "Remplacer outil + contrôle dimensionnel systématique.",
            date_debut: new Date("2025-03-06"),
            date_cloture: new Date("2025-03-18"),
            note: "Contrôle qualité renforcé sur la ligne.",
            first_name: "Walid",
            last_name: "Mahmoud",
            support: "Externe",
            contol_effic: "Oui",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 16,
            created_at: "2025-03-08",
            id_dmpp: "DMPP-17",
            id_rapportnc: "",
            id_scrap: "",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "open",
            progress: 20,
            departement: "Maintenance",
            zone: "Zone B",
            origine: "Machine Z60",
            prob: "Dépassement de température critique.",
            cause: "Sonde défectueuse.",
            action: "Remplacer sonde + test complet.",
            date_debut: new Date("2025-03-09"),
            date_cloture: new Date("2025-03-25"),
            note: "Surveillance thermique programmée.",
            first_name: "Rania",
            last_name: "Feki",
            support: "Interne",
            contol_effic: "Non",
            annul: "Non",
            level: "high level"
        },
        {
            id_planaction: 17,
            created_at: "2025-03-10",
            id_dmpp: "",
            id_rapportnc: "Non-conformité N° 13",
            id_scrap: "Scrap N° 13",
            id_suiviclient: "",
            id_suivifournisseur: "",
            id_supercontrole: null,
            status: "in progress",
            progress: 45,
            departement: "Production",
            zone: "Zone A",
            origine: "Contrôle final",
            prob: "Produit taché lors de l’emballage.",
            cause: "Nettoyage insuffisant du poste.",
            action: "Revoir protocole nettoyage + vérification avant expédition.",
            date_debut: new Date("2025-03-11"),
            date_cloture: new Date("2025-03-22"),
            note: "Inspection renforcée pour prochains lots.",
            first_name: "Rafik",
            last_name: "Sellami",
            support: "Externe",
            contol_effic: "Oui",
            annul: "Non",
            level: "medium level"
        }
    ]);

    const [selectedPlanAction, SetSelectedPlanAction] = useState<PlanAction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isUpdateStatutModelOpen, setIsUpdateStatutModelOpen] = useState(false);

    const navigate = useNavigate();


    // const openModal = (registerscraps: RegistreSCRAP) => {
    //     setRegistrScrap(registerscraps);
    //     setIsModalOpen(true);
    // };


    const deletePlanAction = (id: number) => {
        setPlanaction((prev) => prev.filter((r) => r.id_planaction !== id));
    };


    const handleEdit = (row: PlanAction) => {
        SetSelectedPlanAction(row);
        setIsModalUpdateOpen(true);
    };

    const handleUpdateStatut = (row: PlanAction) => {
        SetSelectedPlanAction(row);
        setIsUpdateStatutModelOpen(true);
    };

    const handleSaveSUpdatetatus = (updated: { id_planaction: number; status: string; progress: number }) => {
        setPlanaction((prev) =>
            prev.map((r) =>
                r.id_planaction === updated.id_planaction
                    ? { ...r, status: updated.status, progress: updated.progress }
                    : r
            )
        );
    };

    const handleSave = (updatedPlanAction: PlanAction) => {
        setPlanaction((prev) =>
            prev.map((r) => (r.id_planaction === updatedPlanAction.id_planaction ? updatedPlanAction : r))
        );
    };


    const getPlanActionOptions = (row: PlanAction) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deletePlanAction(row.id_planaction),
        },
        {
            label: "Modifier Statut",
            onClick: () => handleUpdateStatut(row),
        },
    ];


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
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof PlanAction] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<PlanAction>[] = [
        {
            name: "Source",
            cell: (row: any) => (
                <span>
                    {row.id_rapportnc}
                    {row.id_scrap}
                    {row.id_dmpp}
                    {row.id_suiviclient}
                    {row.id_suivifournisseur}
                    {row.id_supercontrole}
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
            }
        },
        {
            name: "Progresse",
            cell: (row) => {
                return <ProgressBar progress={row.progress} />;
            },
            sortable: false
        },
        { name: "Departement", selector: (row) => row.departement, sortable: true },
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
            selector: (row) => row.date_debut.toLocaleDateString("fr-FR"),
            sortable: true
        },
        {
            name: "Date de cloture",
            selector: (row) => row.date_cloture.toLocaleDateString("fr-FR"),
            sortable: true
        },
        { name: " NOTE(date de retardement ou docs Utilisés pour controle Efficacité ) ", selector: (row) => row.note, sortable: true },
        { name: "Responsable", selector: (row) => row.first_name, sortable: true },
        { name: "Support", selector: (row) => row.support, sortable: true },
        { name: "Controle d efficacité ", selector: (row) => row.contol_effic, sortable: true },
        {
            name: "Annulation",
            cell: (row) => {
                let badgeColor = "bg-gray-300 text-gray-800";

                switch (row.annul.toLowerCase()) {
                    case "Oui":
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
            cell: (row) => <ActionMenu options={getPlanActionOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Plan d'action" description="gestion des plan d'actions" />
            <PageBreadcrumb pageTitle="Plan d'action" />
            <button
                onClick={() => navigate("/plan-action/add-plan-action")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Plan d'action
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des plans d'actions"
                    columns={columns}
                    data={filteredRegsitrScrap}
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
                onSave={handleSaveSUpdatetatus}
            />
        </>
    );
}
