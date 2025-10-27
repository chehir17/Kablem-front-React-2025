import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditRegisterSCRAPModel from "../../components/RegisterSCARP/EditRegisterSCRAPModel";
import ModalPreview from "../../utils/ModelPreview";
import { registreSCRAP } from "../../types/registreSCRAP";
import { SCRAPService } from "../../services/SCRAPService";
import { LigneService } from "../../services/LigneService";
import { UserService } from "../../services/UserService";
import { LotService } from "../../services/LotService";
import { ArticleService } from "../../services/ArticleService";
import { Utilisateur } from "../../types/Utilisateur";
import { Ligne } from "../../types/Ligne";
import { Lot } from "../../types/Lot";
import { Article } from "../../types/Articles";
import { Column } from "../../types/Columns";
import { useUserData } from "../../hooks/useUserData";

export default function RegistreSCRAP() {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [registrScrap, setRegistrScrap] = useState<registreSCRAP[]>([]);
    const [users, setusers] = useState<Utilisateur[]>([]);
    const [Lignes, setLignes] = useState<Ligne[]>([]);
    const [Lots, setLots] = useState<Lot[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [selectedRegistreScrap, SetSelectedRegistreScrap] = useState<registreSCRAP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [type, setType] = useState('scrap');
    const { user: _user, etat100 } = useUserData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataScrap, dataLignes, datausers, dataLots, dataArticles] = await Promise.all([
                    SCRAPService.getSCRAP(),
                    LigneService.getLigne(),
                    UserService.getUsers(),
                    LotService.getLot(),
                    ArticleService.getArticles(),
                ]);

                if (Array.isArray(dataScrap)) setRegistrScrap(dataScrap);
                if (Array.isArray(dataLignes)) setLignes(dataLignes);
                if (Array.isArray(datausers)) setusers(datausers);
                if (Array.isArray(dataLots)) setLots(dataLots);
                if (Array.isArray(dataArticles)) setArticles(dataArticles);

            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const LignesMap = Object.fromEntries(
        Lignes.map((d) => [d.id_ligne, d.nom_ligne])
    );

    const ArticelsMap = Object.fromEntries(
        Articles.map((d) => [d.id_article, d.code_artc])
    );

    const LotsMap = Object.fromEntries(
        Lots.map((d) => [d.id_lot, d.num_lot])
    );

    const oper_1Map = Object.fromEntries(
        users.map((d) => [d.id_user, d.first_name + ' ' + d.last_name])
    );

    const compilateurMap = Object.fromEntries(
        users.map((d) => [d.id_user, d.first_name + ' ' + d.last_name])
    );

    const handleDelete = async (id_scrap: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await SCRAPService.deleteSCRAP(id_scrap);
            setRegistrScrap((prev) => prev.filter((a) => a.id_scrap !== id_scrap));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const handleEdit = (row: registreSCRAP) => {
        SetSelectedRegistreScrap(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedRegisterScrap: registreSCRAP) => {
        setRegistrScrap((prev) =>
            prev.map((r) => (r.id_scrap === updatedRegisterScrap.id_scrap ? updatedRegisterScrap : r))
        );
    };

    // --- Menu dynamique
    const getFichDMPPOptions = (row: registreSCRAP) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => handleDelete(row.id_scrap),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        compilateur: "",
        zone_affe_prob: "",
        code_artc: "",
        first_name: "",
        machine: "",
        nom_ligne: "",
        table_elec: "",
        N_pecRec: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "compilateur", placeholder: "Compilateur" },
        { name: "zone_affe_prob", placeholder: "Zone affectation de probleme" },
        { name: "code_artc", placeholder: "Code Article" },
        { name: "first_name", placeholder: "Client" },
        { name: "machine", placeholder: "Machine" },
        { name: "table_elec", placeholder: "table electrique" },
        { name: "nom_ligne", placeholder: "Non de ligne" },
        { name: "N_ac_corr_ex", placeholder: "N° actions correctives externes" },

    ];
    // Fonction pour filtrer les rapports
    const filteredRegsitrScrap = registrScrap.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof registreSCRAP] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<registreSCRAP>[] = [
        { name: "Created At", selector: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "—", sortable: true },
        { name: "Compilateur", selector: (row) => compilateurMap[row.compilateur] || "Non défini", sortable: true },
        { name: "Zone", selector: (row) => row.zone_affe_prob, sortable: true },
        { name: "Annulation", selector: (row) => row.annulation, sortable: true },
        { name: "Description de probleme", selector: (row) => row.desc_prob, sortable: true },
        { name: "Code article", selector: (row) => ArticelsMap[row.id_article] || "Non défini", sortable: true },
        {
            name: "Date Production",
            selector: (row) => row.date_production ? new Date(row.date_production).toLocaleDateString() : "—",
            sortable: true
        },
        { name: "Opérateur 1", selector: (row) => oper_1Map[row.oper_1] || "Non défini", sortable: true },
        { name: "Costo_U", selector: (row) => row.cout_unit, sortable: true },
        { name: "Machine", selector: (row) => row.machine, sortable: true },
        { name: "Mini", selector: (row) => row.mini, sortable: true },
        { name: "Ligne Assemblage", selector: (row) => LignesMap[row.id_ligne] || "Non défini", sortable: true },
        { name: "Table électrique", selector: (row) => row.table_elec, sortable: true },
        { name: "Qté du Lot", selector: (row) => LotsMap[row.id_lot] || "Non défini", sortable: true },
        { name: "Qté de scrap", selector: (row) => row.qnt_scrap, sortable: true },
        { name: "Cause Probéme", selector: (row) => row.cause_prob, sortable: true },
        { name: "Classification de la cause", selector: (row) => row.classification_cause, sortable: true },
        {
            name: "Actions a prendre",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_immed_prend}
                    title="Actions a prendre"
                    content={row.ac_immed_prend}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "Rebut remplacé", selector: (row) => row.rebut_remplacer, sortable: true },
        { name: "ODL a relancer par la logistique ", selector: (row) => row.odl_rep, sortable: true },
        { name: "Nouvelle ODL", selector: (row) => row.new_odl, sortable: true },
        {
            name: "Description de  Action mise en oeuvre",
            cell: (row) => (
                <ModalPreview
                    label={row.Desc_acmo}
                    title="Description de  Action mise en oeuvre"
                    content={row.Desc_acmo}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "Nombre des pieces récupérés", selector: (row) => row.N_pecRec, sortable: true },
        { name: "Qté Rebutée finale", selector: (row) => row.qnt_rebF, sortable: true },
        { name: "Heures internes dépensés pour rework", selector: (row) => row.h_interne, sortable: true },
        { name: "Heures externes dépensés", selector: (row) => row.h_externe, sortable: true },
        { name: "Cout finale", selector: (row) => row.cout_final, sortable: true },
        { name: "Résultat positif de tri", selector: (row) => row.res_pos, sortable: true },
        {
            name: "Actions correctives supplémentaires",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_corr_suppl}
                    title="Actions correctives supplémentaires"
                    content={row.ac_corr_suppl}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "N° actions correctives externes", selector: (row) => row.N_ac_corr_ex, sortable: true },
        {
            name: "Notes",
            cell: (row) => (
                <ModalPreview
                    label={row.note}
                    title="Notes"
                    content={row.note}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "Poids rebuts", selector: (row) => row.poids_rebut, sortable: true },
        { name: "Valeur SCRAP", selector: (row) => row.valeur_scrap, sortable: true },
        {
            name: "ajout plan action ",
            hidden:etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_scrap + "/" + type)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            hidden:etat100,
            cell: (row) => <ActionMenu options={getFichDMPPOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Registre SCRAP" description="Gestion des registre scrap" />
            <PageBreadcrumb pageTitle="Registre SCRAP" />
            <button
            hidden={etat100}
                onClick={() => navigate("/scrap/add-reg-scrap")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Registre scrap
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des RegistreS SCRAP"
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredRegsitrScrap}
                    loading={loading}
                    error={error}
                />
            </div>
            <EditRegisterSCRAPModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                registerscraps={selectedRegistreScrap}
                onSave={handleSave}
            />
        </>
    );
}
