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
import EditSuiviSuperControleModel from "../../components/SuiviSuperControle/EditSuiviSuperControleModel";

export default function SuiviSuperControle() {

    interface SuiviSuperControle {
        id_supercontrole: number;
        id_article: string;
        rev_projet: string;
        id_client: string;
        type_controle: string;
        doc_refirance: string;
        methode_controle: string;
        date_début: Date;
        duree_estime: number;
        tracibilite_cablage: string;
        tracibilite_carton: string;
        heurs_internedepensees: number;
        date_final: Date;
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }


    const [suiviSuperControle, setSuiviSuperControle] = useState<SuiviSuperControle[]>([
        {
            id_supercontrole: 1,
            id_article: "ART-4521",
            rev_projet: "Rev A",
            id_client: "CL-1001",
            type_controle: "Visuel",
            doc_refirance: "DOC-CTRL-2025-01",
            methode_controle: "Inspection manuelle",
            date_début: new Date("2025-01-10"),
            duree_estime: 2,
            tracibilite_cablage: "CABL-2025-010",
            tracibilite_carton: "CRT-452-89",
            heurs_internedepensees: 1.5,
            date_final: new Date("2025-01-10"),
        },
        {
            id_supercontrole: 2,
            id_article: "ART-7890",
            rev_projet: "Rev B",
            id_client: "CL-2002",
            type_controle: "Dimensionnel",
            doc_refirance: "DOC-CTRL-2025-07",
            methode_controle: "Mesure au pied à coulisse",
            date_début: new Date("2025-02-02"),
            duree_estime: 4,
            tracibilite_cablage: "CABL-2025-045",
            tracibilite_carton: "CRT-785-12",
            heurs_internedepensees: 3.5,
            date_final: new Date("2025-02-02"),
        },
        {
            id_supercontrole: 3,
            id_article: "ART-6325",
            rev_projet: "Rev C",
            id_client: "CL-3003",
            type_controle: "Fonctionnel",
            doc_refirance: "DOC-CTRL-2025-15",
            methode_controle: "Test électrique automatisé",
            date_début: new Date("2025-03-05"),
            duree_estime: 6,
            tracibilite_cablage: "CABL-2025-099",
            tracibilite_carton: "CRT-963-44",
            heurs_internedepensees: 5.8,
            date_final: new Date("2025-03-06"),
        },

    ]);

    const [selectedSuiviSuperControle, SetSelectedSuiviSuperControle] = useState<SuiviSuperControle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    // const openModal = (registerscraps: RegistreSCRAP) => {
    //     setRegistrScrap(registerscraps);
    //     setIsModalOpen(true);
    // };


    const deleteSuiviSuperControle = (id: number) => {
        setSuiviSuperControle((prev) => prev.filter((r) => r.id_supercontrole !== id));
    };


    const handleEdit = (row: SuiviSuperControle) => {
        SetSelectedSuiviSuperControle(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviSuperControle: SuiviSuperControle) => {
        setSuiviSuperControle((prev) =>
            prev.map((r) => (r.id_supercontrole === updatedSuiviSuperControle.id_supercontrole ? updatedSuiviSuperControle : r))
        );
    };

    const getSuiviSuperControleOptions = (row: SuiviSuperControle) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteSuiviSuperControle(row.id_supercontrole),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
            id_article: "",
            rev_projet: "",
            id_client: "",
            type_controle: "",
            tracibilite_cablage: "",
            tracibilite_carton: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "id_article", placeholder: "Code article" },
        { name: "rev_projet", placeholder: "Rev Projet" },
        { name: "id_client", placeholder: "Nom de Client" },
        { name: "type_controle", placeholder: "Type de controle" },
        { name: "tracibilite_cablage", placeholder: "Traçabilité sur câblage" },
        { name: "tracibilite_carton", placeholder: "Traçabilité sur carton" },
    ];

    const filteredSuiviSuperControle = suiviSuperControle.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const fieldValue = String(r[key as keyof SuiviSuperControle] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<SuiviSuperControle>[] = [
        { name: "Code produit ", selector: (row) => row.id_article, sortable: true },
        { name: " Rev Projet", selector: (row) => row.rev_projet, sortable: true },
        { name: "Client (Nom) ", selector: (row) => row.id_client, sortable: true },
        { name: "Type de contrôle (GP12,SLP,CSL2,Sécurisation)", selector: (row) => row.type_controle, sortable: true },
        { name: "Doc de référence", selector: (row) => row.doc_refirance, sortable: true },
        { name: "Méthode de contrôle ", selector: (row) => row.methode_controle, sortable: true },
        { name: "Date de début ", selector: (row) => row.date_début.toLocaleDateString("fr-FR"), sortable: true },
        { name: "Durée estimé ", selector: (row) => row.duree_estime + 'h', sortable: true },
        { name: "Traçabilité sur câblage", selector: (row) => row.tracibilite_cablage, sortable: true },
        { name: "Traçabilité sur carton ", selector: (row) => row.tracibilite_carton, sortable: true },
        { name: "Heures internes dépensées ", selector: (row) => row.heurs_internedepensees + 'h', sortable: true },
        { name: "Date fin ", selector: (row) => row.date_final.toLocaleDateString("fr-FR"), sortable: true },
        {
            name: "ajout plan action ",
            cell: (row) => {
                return <button
                    onClick={() => navigate("/" + row.id_supercontrole)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            cell: (row) => <ActionMenu options={getSuiviSuperControleOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Super Controle" description="Gestion des suivi Super controle" />
            <PageBreadcrumb pageTitle="Suivi Super Controle" />
            <button
                onClick={() => navigate("/suivi-super-controle/add-suivi-super-controle")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi Super Controle
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivi Super Controle "
                    columns={columns}
                    data={filteredSuiviSuperControle}
                />
            </div>
            <EditSuiviSuperControleModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                suivisupercontrole={selectedSuiviSuperControle}
                onSave={handleSave}
            />
        </>
    );
}
