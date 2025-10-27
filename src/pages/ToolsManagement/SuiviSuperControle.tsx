import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditSuiviSuperControleModel from "../../components/SuiviSuperControle/EditSuiviSuperControleModel";
import { Suivisupercontrole } from "../../types/SuiviSuperControle";
import { SuiviSuperControlesService } from "../../services/SuiviSuperControle";
import { useUserData } from "../../hooks/useUserData";
import { Column } from "../../types/Columns";

export default function SuiviSuperControle() {

    const [suiviSuperControle, setSuiviSuperControle] = useState<Suivisupercontrole[]>([]);
    const [selectedSuiviSuperControle, SetSelectedSuiviSuperControle] = useState<Suivisupercontrole | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState('super');

    const { user: _user, etat100 } = useUserData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SuiviSuperControlesService.getSuiviSuperControles();
                setSuiviSuperControle(data);
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


    const handleDelete = async (id_supercontrole: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await SuiviSuperControlesService.deleteSuiviSuperControles(id_supercontrole);
            setSuiviSuperControle((prev) => prev.filter((a) => a.id_supercontrole !== id_supercontrole));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const handleEdit = (row: Suivisupercontrole) => {
        SetSelectedSuiviSuperControle(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedSuiviSuperControle: Suivisupercontrole) => {
        setSuiviSuperControle((prev) =>
            prev.map((r) => (r.id_supercontrole === updatedSuiviSuperControle.id_supercontrole ? updatedSuiviSuperControle : r))
        );
    };

    const getSuiviSuperControleOptions = (row: Suivisupercontrole) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => handleDelete(row.id_supercontrole),
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
            const fieldValue = String(r[key as keyof Suivisupercontrole] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });

    const columns: Column<Suivisupercontrole>[] = [
        { name: "Code produit ", selector: (row) => row.code_artc, sortable: true },
        { name: " Rev Projet", selector: (row) => row.rev_projet, sortable: true },
        { name: "Client (Nom) ", selector: (row) => row.nom_client, sortable: true },
        { name: "Type de contrôle (GP12,SLP,CSL2,Sécurisation)", selector: (row) => row.type_controle, sortable: true },
        { name: "Doc de référence", selector: (row) => `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.doc_refirance}`, sortable: true },
        { name: "Méthode de contrôle ", selector: (row) => row.methode_controle, sortable: true },
        { name: "Date de début ", selector: (row) => row.date_debut ? new Date(row.date_debut).toLocaleDateString() : "—", sortable: true },
        { name: "Durée estimé ", selector: (row) => row.duree_estime ? new Date(row.duree_estime).toLocaleDateString() : "—", sortable: true },
        { name: "Traçabilité sur câblage", selector: (row) => row.tracibilite_cablage, sortable: true },
        { name: "Traçabilité sur carton ", selector: (row) => row.tracibilite_carton, sortable: true },
        { name: "Heures internes dépensées ", selector: (row) => row.heurs_internedepensees + 'h', sortable: true },
        { name: "Date fin ", selector: (row) => row.date_final ? new Date(row.date_final).toLocaleDateString() : "—", sortable: true },
        {
            name: "ajout plan action ",
            hidden:etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_supercontrole + "/" + type)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            hidden:etat100,
            cell: (row) => <ActionMenu options={getSuiviSuperControleOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Suivi Super Controle" description="Gestion des suivi Super controle" />
            <PageBreadcrumb pageTitle="Suivi Super Controle" />
            <button
                onClick={() => navigate("/suivi-super-controle/add-suivi-super-controle")}
                hidden={etat100}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Suivi Super Controle
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Suivi Super Controle "
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredSuiviSuperControle}
                    loading={loading}
                    error={error}
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
