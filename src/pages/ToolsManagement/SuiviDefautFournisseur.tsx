import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditSuiviFournsisseurModel from "../../components/SuiviFournisseur/EditSuiviFournisseurModel";
import { Download } from "lucide-react";
import ModalPreview from "../../utils/ModelPreview";

export default function SuiviFournisseur() {

    interface SuiviFournisseur {
        id_suivifournisseur: number;
        created_at: Date;
        id_article: string;
        id_fournisseur: string;
        classification: string;
        desc_prob: string;
        pcs_ko_detecte: number;
        triage: string;
        tot_pcs_ko: number;
        decision: string;
        derogation: string;
        cout_tret: number;
        statut: string;
        notes: string;
        piece_joint: string;
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }


    const [suiviFournisseur, setSuiviFournisseur] = useState<SuiviFournisseur[]>([
        {
            id_suivifournisseur: 1,
            created_at: new Date("2025-09-01"),
            id_article: "ART-001",
            id_fournisseur: "FRN-001",
            classification: "Critique",
            desc_prob: "Les pièces livrées présentent des fissures visibles.",
            pcs_ko_detecte: 12,
            triage: "Non",
            tot_pcs_ko: 12,
            decision: "Rejet total",
            derogation: "Non",
            cout_tret: 2500,
            statut: "Ouvert",
            notes: "Demande d'audit fournisseur envoyée.",
            piece_joint: "rapport_inspection.pdf"
        },
        {
            id_suivifournisseur: 2,
            created_at: new Date("2025-09-03"),
            id_article: "ART-002",
            id_fournisseur: "FRN-002",
            classification: "Majeur",
            desc_prob: "Erreur dans la dimension des composants fournis.",
            pcs_ko_detecte: 15,
            triage: "Oui",
            tot_pcs_ko: 30,
            decision: "Réparation interne",
            derogation: "Oui",
            cout_tret: 1800,
            statut: "En cours",
            notes: "Attente de validation de la dérogation.",
            piece_joint: "photos_defaut.zip"
        },

        {
            id_suivifournisseur: 3,
            created_at: new Date("2025-11-03"),
            id_article: "ART-003",
            id_fournisseur: "FRN-003",
            classification: "Mineur",
            desc_prob: "Petites rayures sur la surface mais sans impact fonctionnel.",
            pcs_ko_detecte: 5,
            triage: "Non",
            tot_pcs_ko: 5,
            decision: "Accepté sous dérogation",
            derogation: "Oui",
            cout_tret: 0,
            statut: "Clôturé",
            notes: "Incident toléré, pas d'impact sur la production.",
            piece_joint: "rapport_quality.docx"
        },
        {
            id_suivifournisseur: 4,
            created_at: new Date("2025-11-27"),
            id_article: "ART-004",
            id_fournisseur: "FRN-004",
            classification: "Critique",
            desc_prob: "Lot incomplet, 15 pièces manquantes à la livraison.",
            pcs_ko_detecte: 15,
            triage: "Oui",
            tot_pcs_ko: 15,
            decision: "Renvoi partiel",
            derogation: "Non",
            cout_tret: 950,
            statut: "Annulé",
            notes: "Commande annulée et nouvelle livraison demandée.",
            piece_joint: "bon_livraison.pdf"
        }


    ]);

    const [selectedSuiviFournisseur, SetSelectedSuiviFournisseur] = useState<SuiviFournisseur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    // const openModal = (registerscraps: RegistreSCRAP) => {
    //     setRegistrScrap(registerscraps);
    //     setIsModalOpen(true);
    // };


    const deleteSuiviFournisseur = (id: number) => {
        setSuiviFournisseur((prev) => prev.filter((r) => r.id_suivifournisseur !== id));
    };


    const handleEdit = (row: SuiviFournisseur) => {
        SetSelectedSuiviFournisseur(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviFournisseur: SuiviFournisseur) =>
        setSuiviFournisseur((prev) =>
            prev.map((r) => (r.id_suivifournisseur === updatedSuiviFournisseur.id_suivifournisseur ? updatedSuiviFournisseur : r))
        );

    const getSuiviFournisseurOptions = (row: SuiviFournisseur) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteSuiviFournisseur(row.id_suivifournisseur),
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
            const fieldValue = String(r[key as keyof SuiviFournisseur] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<SuiviFournisseur>[] = [
        { name: "Date Création", selector: (row) => row.created_at.toLocaleDateString("fr-FR"), sortable: true },
        { name: "Code Article", selector: (row) => row.id_article, sortable: true },
        { name: "Nom Fournisseur", selector: (row) => row.id_fournisseur, sortable: true },
        { name: "Classification", selector: (row) => row.classification, sortable: true },
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
                        href={row.piece_joint}
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
            name: "Actions",
            cell: (row) => <ActionMenu options={getSuiviFournisseurOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Fournisseur" description="Gestion des suivis des fournisseurs" />
            <PageBreadcrumb pageTitle="Suivi Fournisseur" />
            <button
                onClick={() => navigate("/suivi-fournisseur/add-suivi-fournisseur")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi Fournisseur
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivis Fournisseur "
                    columns={columns}
                    data={filteredSuiviFournisseur}
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
