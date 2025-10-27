import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { Modal } from "../../components/ui/modal";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditFIchDMPPModal from "../../components/FichDMPP/EditFichDMPPMdoel";
import ModalPreview from "../../utils/ModelPreview";
import { FichDMPPService } from "../../services/FichDMPP";
import { FicheDMPP } from "../../types/FichDMPP";
import { Column } from "../../types/Columns";
import { useUserData } from "../../hooks/useUserData";

export default function FichDMPP() {

    const [fichdmpps, setFichdmpps] = useState<FicheDMPP[]>([]);
    const [selectedFichDMPP, SetSelectedFichDMPP] = useState<FicheDMPP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('dmpp');

    const { user: _user, etat100 } = useUserData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await FichDMPPService.getDMPP();
                setFichdmpps(data);
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

    const openModal = (fichdmpps: FicheDMPP) => {
        SetSelectedFichDMPP(fichdmpps);
        setIsModalOpen(true);
    };



    //delete fiche dmpp
    const handleDelete = async (id_dmpp: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await FichDMPPService.deleteDMPP(id_dmpp);
            setFichdmpps((prev) => prev.filter((a) => a.id_dmpp !== id_dmpp));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const handleEdit = (row: FicheDMPP) => {
        SetSelectedFichDMPP(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedfichdmpp: FicheDMPP) => {
        setFichdmpps((prev) =>
            prev.map((r) => (r.id_dmpp === updatedfichdmpp.id_dmpp ? updatedfichdmpp : r))
        );
    };

    const getFichDMPPOptions = (row: FicheDMPP) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => handleDelete(row.id_dmpp),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        nom_ligne: "",
        code_artc: "",
        nature: "",
        zone: "",
        type: "",
        nom_client: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "nom_ligne", placeholder: "Filtrer par nom de ligne" },
        { name: "code_artc", placeholder: "Filtrer par code article" },
        { name: "nature", placeholder: "Filtrer par Nature" },
        { name: "zone", placeholder: "Filtrer par Zone" },
        { name: "type", placeholder: "Filtrer par Type" },
        { name: "nom_client", placeholder: "Filtrer par Nom client" },

    ];
    // Fonction pour filtrer les rapports
    const filteredFichDMPP = fichdmpps.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof FicheDMPP] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<FicheDMPP>[] = [
        { name: "Ligne", selector: (row) => row.nom_ligne, sortable: true },
        { name: "Poste", selector: (row) => row.post, sortable: true },
        { name: "Réf", selector: (row) => row.code_artc, sortable: true },
        { name: "Nature", selector: (row) => row.nature, sortable: true },
        { name: "Zone", selector: (row) => row.zone, sortable: true },
        {
            name: "Date souhaité",
            selector: (row) => row.date_sou ? new Date(row.date_sou).toLocaleDateString() : "—",
            sortable: true
        },
        { name: "Type (produit/process/Changement de réf) ", selector: (row) => row.type, sortable: true },
        { name: "Description client", selector: (row) => row.nom_client, sortable: true },
        { name: "Coût estimatif ", selector: (row) => row.cout_estimative + " TND", sortable: true },
        {
            name: "Etat actuel",
            cell: (row) => {
                let badgeColor = "bg-gray-300 text-gray-800";

                switch (row.etat_actu.toLowerCase()) {
                    case "en cours":
                        badgeColor = "bg-yellow-100 text-yellow-800";
                        break;
                    case "terminé":
                        badgeColor = "bg-green-100 text-green-800";
                        break;
                    case "planifié":
                        badgeColor = "bg-blue-100 text-blue-800";
                        break;
                    case "bloqué":
                        badgeColor = "bg-red-100 text-red-800";
                        break;
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {row.etat_actu}
                    </span>
                );
            },
            sortable: true,
        },
        { name: "Etat modifié", selector: (row) => row.etat_modif, sortable: true },
        {
            name: "Objectif",
            cell: (row) => (
                <ModalPreview
                    label={row.objectif_modif}
                    title="Objectif modification"
                    content={row.objectif_modif}
                    maxLength={20}
                />
            ),
        },
        {
            name: "ajout plan action ",
            hidden: etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_dmpp + "/" + type)}
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
            <PageMeta title="Fiche DMPP" description="Gestion des Fiches DMpp" />
            <PageBreadcrumb pageTitle="Fiche DMPP" />
            <button
                onClick={() => navigate("/fich-dmpp/add-fich-dmpp")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
                hidden={etat100}
            >
                Ajouter une Fich DMPP
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des FicheS DMPP"
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredFichDMPP}
                    loading={loading}
                    error={error}
                />
            </div>
            <EditFIchDMPPModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                fichdmpps={selectedFichDMPP}
                onSave={handleSave}
            />
        </>
    );
}
