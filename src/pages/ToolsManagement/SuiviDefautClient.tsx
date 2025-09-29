import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditRapportNcModal from "../../components/RapportNC/EditRapportNCForm";
import EditRegisterSCRAPModel from "../../components/RegisterSCARP/EditRegisterSCRAPModel";
import EditSuiviClientModel from "../../components/SuiviClient/EditSuiviClientModel";
import ModalPreview from "../../utils/ModelPreview";
import ImageCarousel from "../../utils/ImageCarousel";

export default function SuiviIncidentClient() {

    interface SuiviIncidentClient {
        id_suiviclient: number;
        num_rec_cli: string;
        date_rec_cli: Date;
        zone: string;
        id_client: string | null;
        id_article: string | null;
        nom_projet: string;
        phase_projet: string;
        desc_deff: string;
        photo_ok: string;
        photo_nok: string;
        nbr_piec_ko: string;
        type_incidant: string;
        num_rec_four: string;
        recurence: string;
        statut: string;
        cout_non_quat_s_rec: string;
        level: string | null
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }


    const [suiviClient, setSuiviClient] = useState<SuiviIncidentClient[]>([
        {
            id_suiviclient: 1,
            num_rec_cli: "CLI-2025-001",
            date_rec_cli: new Date("2025-01-15"),
            zone: "Atelier A1",
            id_client: "C123",
            id_article: "ART567",
            nom_projet: "Pont Métallique",
            phase_projet: "Fabrication",
            desc_deff: "Défaut de soudure détecté sur 2 pièces.",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            nbr_piec_ko: "2",
            type_incidant: "Qualité",
            num_rec_four: "FOUR-0023",
            recurence: "Faible",
            statut: "Ouvert",
            cout_non_quat_s_rec: "150",
            level: "Low"
        },
        {
            id_suiviclient: 2,
            num_rec_cli: "CLI-2025-002",
            date_rec_cli: new Date("2025-02-05"),
            zone: "Zone Peinture",
            id_client: "C456",
            id_article: "ART890",
            nom_projet: "Usine Automobile",
            phase_projet: "Montage",
            desc_deff: "Écaillage de peinture constaté sur plusieurs lots.",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            nbr_piec_ko: "35",
            type_incidant: "Produit non conforme",
            num_rec_four: "FOUR-0045",
            recurence: "Élevée",
            statut: "En cours",
            cout_non_quat_s_rec: "3200",
            level: "high level"
        },
        {
            id_suiviclient: 3,
            num_rec_cli: "CLI-2025-003",
            date_rec_cli: new Date("2025-03-01"),
            zone: "Zone Assemblage",
            id_client: "C789C221",
            id_article: "ART-789",
            nom_projet: "Pipeline Gaz",
            phase_projet: "Inspection",
            desc_deff: "Retard livraison pièce critique.",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            nbr_piec_ko: "0",
            type_incidant: "Logistique",
            num_rec_four: "FOUR-0088",
            recurence: "Moyenne",
            statut: "Clôturé",
            cout_non_quat_s_rec: "0",
            level: null
        }

    ]);

    const [selectedSuiviClient, SetSelectedSuiviClient] = useState<SuiviIncidentClient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    // const openModal = (registerscraps: RegistreSCRAP) => {
    //     setRegistrScrap(registerscraps);
    //     setIsModalOpen(true);
    // };


    const deleteSuiviClient = (id: number) => {
        setSuiviClient((prev) => prev.filter((r) => r.id_suiviclient !== id));
    };


    const handleEdit = (row: SuiviIncidentClient) => {
        SetSelectedSuiviClient(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviClient: SuiviIncidentClient) => {
        setSuiviClient((prev) =>
            prev.map((r) => (r.id_suiviclient === updatedSuiviClient.id_suiviclient ? updatedSuiviClient : r))
        );
    };

    const getFichDMPPOptions = (row: SuiviIncidentClient) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteSuiviClient(row.id_suiviclient),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        num_rec_cli: "",
        zone: "",
        nom_projet: "",
        phase_projet: "",
        type_incidant: "",
        num_rec_four: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "num_rec_cli", placeholder: "Num. Réclamation Client  " },
        { name: "zone", placeholder: "Zone" },
        { name: "nom_projet", placeholder: "Nom de projet" },
        { name: "phase_projet", placeholder: "Phase de projet" },
        { name: "type_incidant", placeholder: "Type de l'incidant" },
        { name: "num_rec_four", placeholder: "N° de réclamation au fournisseur " },
    ];

    const filteredRegsitrScrap = suiviClient.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const fieldValue = String(r[key as keyof SuiviIncidentClient] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<SuiviIncidentClient>[] = [
        { name: "Num. Réclamation Client", selector: (row) => row.num_rec_cli, sortable: true },
        { name: "Date Réclamation Client", selector: (row) => row.date_rec_cli.toLocaleDateString("fr-FR"), sortable: true },
        { name: "Zone", selector: (row) => row.zone, sortable: true },
        { name: "Client", selector: (row) => row.id_client!, sortable: true },
        { name: "Référence Produit ", selector: (row) => row.id_article!, sortable: true },
        { name: "Projet", selector: (row) => row.nom_projet, sortable: true },
        {
            name: "Phase de Projet",
            selector: (row: any) => row.phase_projet,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-200 text-gray-800";
                switch (row.phase_projet) {
                    case "Fabrication":
                        colorClass = "bg-blue-100 text-blue-800";
                        break;
                    case "Montage":
                        colorClass = "bg-green-100 text-green-800";
                        break;
                    case "Inspection":
                        colorClass = "bg-yellow-100 text-yellow-800";
                        break;
                    case "Livraison":
                        colorClass = "bg-purple-100 text-purple-800";
                        break;
                    default:
                        colorClass = "bg-gray-100 text-gray-600";
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                    >
                        {row.phase_projet}
                    </span>
                );
            },
        },
        {
            name: "Descriptif du défaut",
            cell: (row) => (
                <ModalPreview
                    label={row.desc_deff}
                    title="Descriptif du défaut"
                    content={row.desc_deff}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        {
            name: "Photos",
            cell: (row) => (
                <ImageCarousel
                    images={[
                        { src: row.photo_ok ?? "", alt: "Photo OK", caption: "Photo OK" },
                        { src: row.photo_nok ?? "", alt: "Photo Non OK", caption: "Photo Non OK" },
                    ]}
                />
            ),
        },
        { name: "Type incidents", selector: (row) => row.type_incidant, sortable: true },
        { name: "N° de réclamation au fournisseur ", selector: (row) => row.num_rec_four, sortable: true },
        { name: "Récurrence", selector: (row) => row.recurence, sortable: true },
        {
            name: "Statut",
            selector: (row: any) => row.statut,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-100 text-gray-600"; // défaut
                switch (row.statut) {
                    case "Ouvert":
                        colorClass = "bg-blue-100 text-blue-800";
                        break;
                    case "En cours":
                        colorClass = "bg-yellow-100 text-yellow-800";
                        break;
                    case "Clôturé":
                        colorClass = "bg-green-100 text-green-800";
                        break;
                    case "Annulé":
                        colorClass = "bg-red-100 text-red-800";
                        break;
                    default:
                        colorClass = "bg-gray-200 text-gray-700";
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                    >
                        {row.statut}
                    </span>
                );
            },
        }, { name: "CNQ suite réclamation", selector: (row) => row.cout_non_quat_s_rec, sortable: true },
        {
            name: "ajout plan action ",
            cell: (row) => {
                return <button
                    onClick={() => navigate("/fich-dmpp/add-fich-dmpp/" + row.id_suiviclient)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            cell: (row) => <ActionMenu options={getFichDMPPOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Incident Client" description="Gestion des suivi des incident client" />
            <PageBreadcrumb pageTitle="Suivi Incident Client" />
            <button
                onClick={() => navigate("/suivi-client/add-suivi-client")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi des incidant Client
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivis Clients "
                    columns={columns}
                    data={filteredRegsitrScrap}
                />
            </div>
            <EditSuiviClientModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                suiviclient={selectedSuiviClient}
                onSave={handleSave}
            />
        </>
    );
}
