import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditSuiviFournsisseurModel from "../../components/SuiviFournisseur/EditSuiviFournisseurModel";
import ModalPreview from "../../utils/ModelPreview";
import { Suivifournisseur } from "../../types/Suivifournisseur";
import { SuiviFournisseurService } from "../../services/SuiviFournissuerService";
import { Column } from "../../types/Columns";
import { useUserData } from "../../hooks/useUserData";

export default function SuiviFournisseur() {


    const [suiviFournisseur, setSuiviFournisseur] = useState<Suivifournisseur[]>([]);
    const [selectedSuiviFournisseur, SetSelectedSuiviFournisseur] = useState<Suivifournisseur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState('suivifournisseur');
    const { user: _user, etat100 } = useUserData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SuiviFournisseurService.getSuiviFournisseur();
                setSuiviFournisseur(data);
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



    const handleDelete = async (id_suivifournisseur: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await SuiviFournisseurService.deleteSuiviFournisseur(id_suivifournisseur);
            setSuiviFournisseur((prev) => prev.filter((a) => a.id_suivifournisseur !== id_suivifournisseur));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };


    const handleEdit = (row: Suivifournisseur) => {
        SetSelectedSuiviFournisseur(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviFournisseur: Suivifournisseur) =>
        setSuiviFournisseur((prev) =>
            prev.map((r) => (r.id_suivifournisseur === updatedSuiviFournisseur.id_suivifournisseur ? updatedSuiviFournisseur : r))
        );

    const getSuiviFournisseurOptions = (row: Suivifournisseur) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => handleDelete(row.id_suivifournisseur),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        id_article: "",
        id_fournisseur: "",
        classification: "",
        triage: "",
        decision: "",
        derogation: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "id_article", placeholder: "Code Article" },
        { name: "id_fournisseur", placeholder: "Nom de Fournisseur" },
        { name: "classification", placeholder: "Classification" },
        { name: "triage", placeholder: "Triage" },
        { name: "decision", placeholder: "Decision" },
        { name: "derogation", placeholder: "Derogation" },
    ];

    const filteredSuiviFournisseur = suiviFournisseur.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const fieldValue = String(r[key as keyof Suivifournisseur] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<Suivifournisseur>[] = [
        { name: "Date Création", selector: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "—", sortable: true },
        { name: "Code Article", selector: (row) => row.code_artc, sortable: true },
        { name: "Nom Fournisseur", selector: (row) => row.nom_fournisseur, sortable: true },
        { name: "Classification", selector: (row) => row.class, sortable: true },
        { name: "Description de Probléme", selector: (row) => row.desc_prob!, sortable: true },
        { name: "Pcs KO détectées ", selector: (row) => row.pcs_ko_detecte, sortable: true },
        {
            name: " Tirage(Oui/Non)",
            selector: (row: any) => row.triage,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-200 text-gray-800";
                switch (row.triage) {
                    case "Oui":
                        colorClass = "bg-green-100 text-green-800";
                        break;
                    case "Non":
                        colorClass = "bg-red-100 text-red-800";
                        break;
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                    >
                        {row.triage}
                    </span>
                );
            },
        },
        { name: "Total des pcs KO ", selector: (row) => row.tot_pcs_ko, sortable: true },
        { name: "Décision", selector: (row) => row.decision, sortable: true },
        {
            name: "Dérogation (Oui/Non)",
            selector: (row: any) => row.derogation,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-200 text-gray-800";
                switch (row.derogation) {
                    case "Oui":
                        colorClass = "bg-green-100 text-green-800";
                        break;
                    case "Non":
                        colorClass = "bg-red-100 text-red-800";
                        break;
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                    >
                        {row.derogation}
                    </span>
                );
            },
        },
        { name: "Cout de Traitement", selector: (row) => row.cout_tret + " TND", sortable: true },
        {
            name: "Statut",
            selector: (row: any) => row.statut,
            sortable: true,
            cell: (row: any) => {
                let colorClass = "bg-gray-100 text-gray-600";
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
        },
        {
            name: "Notes",
            cell: (row) => (
                <ModalPreview
                    label={row.notes}
                    title="Notes"
                    content={row.notes}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        {
            name: "Pièces Jointes",
            cell: (row: any) =>
                row.piece_joint ? (
                    <a
                        href={`http://localhost/platforme_KablemSPA_backEnd/public/files/${row.piece_joint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        download
                    >
                        📎 Télécharger
                    </a>
                ) : (
                    <span className="text-gray-400 italic">Aucune pièce</span>
                ),
            sortable: false,
        },
        {
            name: "ajout plan action ",
            hidden: etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_suivifournisseur + "/" + type)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            hidden: etat100,
            cell: (row) => <ActionMenu options={getSuiviFournisseurOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Fournisseur" description="Gestion des suivis des fournisseurs" />
            <PageBreadcrumb pageTitle="Suivi Fournisseur" />
            <button
                hidden={etat100}
                onClick={() => navigate("/suivi-fournisseur/add-suivi-fournisseur")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi Fournisseur
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivis Fournisseur "
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredSuiviFournisseur}
                    loading={loading}
                    error={error}
                />
            </div>
            <EditSuiviFournsisseurModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                suivifournisseur={selectedSuiviFournisseur}
                onSave={handleSave}
            />
        </>
    );
}
