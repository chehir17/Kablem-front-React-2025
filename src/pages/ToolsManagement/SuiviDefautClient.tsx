import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditSuiviClientModel from "../../components/SuiviClient/EditSuiviClientModel";
import ModalPreview from "../../utils/ModelPreview";
import ImageCarousel from "../../utils/ImageCarousel";
import { SuiviDefautClient } from "../../types/SuiviDefautclient";
import { SuiviClientService } from "../../services/SuiviDefautClientService";
import { Column } from "../../types/Columns";
import { useUserData } from "../../hooks/useUserData";

export default function SuiviIncidentClient() {

    const [suiviClient, setSuiviClient] = useState<SuiviDefautClient[]>([]);
    const [selectedSuiviClient, SetSelectedSuiviClient] = useState<SuiviDefautClient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('suiviclient');
    const { user: _user, etat100 } = useUserData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SuiviClientService.getSuiviClient();
                setSuiviClient(data);
                console.log(data);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //delete suivi client 
    const handleDelete = async (id_suiviclient: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await SuiviClientService.delete(id_suiviclient);
            setSuiviClient((prev) => prev.filter((a) => a.id_suiviclient !== id_suiviclient));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };


    const handleEdit = (row: SuiviDefautClient) => {
        SetSelectedSuiviClient(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviClient: SuiviDefautClient) => {
        setSuiviClient((prev) =>
            prev.map((r) => (r.id_suiviclient === updatedSuiviClient.id_suiviclient ? updatedSuiviClient : r))
        );
    };

    const getFichDMPPOptions = (row: SuiviDefautClient) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => handleDelete(row.id_suiviclient),
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
            const fieldValue = String(r[key as keyof SuiviDefautClient] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<SuiviDefautClient>[] = [
        { name: "Num. Réclamation Client", selector: (row) => row.num_rec_cli, sortable: true },
        { name: "Date Réclamation Client", selector: (row) => row.date_rec_cli ? new Date(row.date_rec_cli).toLocaleDateString() : "—", sortable: true },
        { name: "Zone", selector: (row) => row.zone, sortable: true },
        { name: "Client", selector: (row) => row.nom_client!, sortable: true },
        { name: "Référence Produit ", selector: (row) => row.ref!, sortable: true },
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
                        { src: `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo_ok}`, alt: "Photo OK", caption: "Photo OK" },
                        { src: `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo_nok}`, alt: "Photo Non OK", caption: "Photo Non OK" },
                    ]}
                />
            ),
        },
        { name: "Type incidents", selector: (row) => row.type_incidant, sortable: true },
        { name: "N° de réclamation au fournisseur ", selector: (row) => 'Reclamation N° ' + row.id_suivifournisseur, sortable: true },
        { name: "Récurrence", selector: (row) => row.recurence, sortable: true },
        {
            name: "Statut",
            selector: (row: any) => row.statut,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-100 text-gray-600"
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
            hidden: etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_suiviclient + "/" + type)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            hidden: etat100,
            cell: (row) => <ActionMenu options={getFichDMPPOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Incident Client" description="Gestion des suivi des incident client" />
            <PageBreadcrumb pageTitle="Suivi Incident Client" />
            <button
                hidden={etat100}
                onClick={() => navigate("/suivi-client/add-suivi-client")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi des incidant Client
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivis Clients "
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredRegsitrScrap}
                    loading={loading}
                    error={error}
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
