import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { Modal } from "../../components/ui/modal";
import ActionMenu from "../../utils/ActionOption";
import EditRapportNcModal from "../../components/RapportNC/EditRapportNCForm";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import ModalPreview from "../../utils/ModelPreview";
import ImageCarousel from "../../utils/ImageCarousel";
import { RapportNC } from "../../types/RapportNC";
import { RapportNcService } from "../../services/RapportNcService";
import { ACAPService } from "../../services/ACAP";
import { ACAP } from "../../types/ACAP";
import { Column } from "../../types/Columns";

export default function RapportNonConformite() {

    const [type, setType] = useState('nc');
    const [rapports, setRapports] = useState<RapportNC[]>([]);

    const [selectedRapport, setSelectedRapport] = useState<RapportNC | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [acap, setacap] = useState<ACAP[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [user, setUser] = useState<any>(null);
    const [etat100, setetat100] = useState(true);

    const getConnectedUserdata = () => {
        const userData = localStorage.getItem("userData");
        const storedUser = userData ? JSON.parse(userData) : null;
        console.log("Utilisateur trouvé :", storedUser);
        setUser(storedUser);
        return storedUser;
    };

    useEffect(() => {
        getConnectedUserdata();
    }, []);

    useEffect(() => {
        if (!user) return;
        if (user.role !== "user") {
            setetat100(false);
        }
    }, [user]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await RapportNcService.getRapport();
                setRapports(data);
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

    useEffect(() => {
        if (!selectedRapport) return;
        const fetchAcap = async () => {
            try {
                const response = await ACAPService.getById(selectedRapport.id_rapportnc);
                const data = response.data;
                if (Array.isArray(data)) setacap(data);
                else console.error("La réponse n'est pas un tableau :", data);
            } catch (err) {
                setError("❌ Impossible de charger les Actions.");
                console.error(err);
            }
        };
        fetchAcap();
    }, [selectedRapport]);

    const openModal = (rapport: RapportNC) => {
        setSelectedRapport(rapport);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [newAction, setNewAction] = useState<ACAP>({
        id_acap: 0,
        type: "",
        acap: "",
        id_rapportnc: 0,
    });

    const addAction = async () => {
        if (!selectedRapport) return;

        if (!validateForm()) return;

        try {
            const formData = new FormData();
            formData.append("type", newAction.type);
            formData.append("acap", newAction.acap);
            formData.append("id_rapportnc", selectedRapport.id_rapportnc.toString());

            const res = await ACAPService.create(formData);

            setacap((prev) => [...prev, res.data]);
            setNewAction({ id_acap: 0, type: "", acap: "", id_rapportnc: selectedRapport.id_rapportnc });
            setLoading(false);
            setIsModalOpen(false);
            window.location.href = "/rapport-nc";
            swal("Succès", "Action ajoutée avec succès.", "success");
        } catch (err) {
            setLoading(false);
            console.error(err);
            swal("Erreur", "Impossible d’ajouter l’action.", "error");
        }
    };


    const validateForm = () => {
        let newErrors: any = {};

        if (!newAction.acap) newErrors.acap = "Le description est requis";
        if (!newAction.type) newErrors.type = "Le type est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const deleteAction = async (id_acap: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await ACAPService.delete(id_acap);
            setacap((prev) => prev.filter((a) => a.id_acap !== id_acap));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const handleEdit = (row: RapportNC) => {
        setSelectedRapport(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedRapport: RapportNC) => {
        setRapports((prev) =>
            prev.map((r) => (r.id_rapportnc === updatedRapport.id_rapportnc ? updatedRapport : r))
        );
    };

    //delete Rapport nc 
    const handleDelete = async (id_rapportnc: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await RapportNcService.delete(id_rapportnc);
            setRapports((prev) => prev.filter((a) => a.id_rapportnc !== id_rapportnc));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const getRapportOptions = (row: RapportNC) => {
        const options = [];
        if (!etat100) {
            options.push({
                label: "Modifier",
                onClick: () => handleEdit(row),
            });
        }

        if (!etat100) {
            options.push({
                label: "Supprimer",
                onClick: () => handleDelete(row.id_rapportnc),
            });
        }

        if (!etat100) {
            options.push({
                label: "AC/AP",
                onClick: () => openModal(row),
            });
        }

        return options;
    };


    const [filters, setFilters] = useState<Record<string, string>>({
        date: "",
        code_article: "",
        lot: "",
        sujet: "",
        quantite_nc: "",
        process: "",
        client: "",
        occurance_defaut: "",
        ac_immed: "",
        date_ac_immed: "",
        date_verif_ac_immed: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "code_article", placeholder: "Filtrer par Code Article" },
        { name: "lot", placeholder: "Filtrer par Lot" },
        { name: "sujet", placeholder: "Filtrer par Sujet" },
        { name: "process", placeholder: "Filtrer par Process" },
        { name: "client", placeholder: "Filtrer par Client" },
        { name: "occurance_defaut", placeholder: "Filtrer par Occurence" },

    ];

    // Fonction pour filtrer les rapports
    const filteredRapports = rapports.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof RapportNC] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<RapportNC>[] = [
        { name: "Date Création", selector: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "—", sortable: true },
        { name: "Code Article", selector: (row) => row.code_artc || "Non défini", sortable: true },
        { name: "N° Lot/date ", selector: (row) => row.num_lot_date, sortable: true },
        {
            name: "Photos",
            cell: (row) => (
                <ImageCarousel
                    images={[
                        { src: `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo_ok}`, alt: "Photo OK", caption: "Photo OK" },
                        { src: `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo_nok}`, alt: "Photo Non OK", caption: "Photo Non OK" },
                        { src: `http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo_idant}`, alt: "Photo Identité", caption: "Photo Identité" },
                    ]}
                />
            ),
        },
        { name: "Quantité NC", selector: (row) => row.qte_nc, sortable: true },
        { name: "Process", selector: (row) => row.process, sortable: true },
        { name: "Nom Client", selector: (row) => row.nom_client || "Non défini", sortable: true },
        {
            name: "Sujet",
            cell: (row) => (
                <ModalPreview
                    label={row.sujet_non_conformite}
                    title="Sujet"
                    content={row.sujet_non_conformite}
                    maxLength={20}
                />
            ),
        },
        { name: "Occurance Défaut", selector: (row) => row.occurance_defaut, sortable: true },
        {
            name: "Action Immédiate",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_immed}
                    title="Action Immédiate"
                    content={row.ac_immed}
                    maxLength={20}
                />
            ),
        },
        { name: "Date Action Immédiate", selector: (row) => row.date_ac_immed, sortable: true },
        { name: "Date vérification Action Immédiate", selector: (row) => row.date_verf_ac_immed, sortable: true },
        {
            name: "ajout plan action ",
            hidden: etat100,
            cell: (row) => {
                return <button
                    onClick={() => navigate("/plan-action/add-plan-action/" + row.id_rapportnc + "/" + type)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                    hidden={etat100}
                >
                    plan d'action
                </button>;
            }
        },
        {
            name: "Actions & (AC/AP)",
            hidden: etat100,
            cell: (row) => <ActionMenu hidden={etat100} options={getRapportOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Rapport Non Conformité" description="Gestion des rapports NC" />
            <PageBreadcrumb pageTitle="Rapport Non Conformité" />
            <button
                onClick={() => navigate("/rapport-nc/add-rnc")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
                hidden={etat100}
            >
                Ajouter un Rapport NC
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Rapports de non Conformité"
                    columns={columns.filter((col) => !col.hidden)}
                    data={filteredRapports}
                    loading={loading}
                    error={error}
                />
            </div>
            <EditRapportNcModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                rapportnc={selectedRapport}
                onSave={handleSave}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Actions Correctives / Préventives (Rapport {selectedRapport?.id_rapportnc})
                        </h4>
                        <ul className="mb-4">
                            {acap.length === 0 ? (
                                <p className="text-gray-500 italic">Aucune action pour ce rapport.</p>
                            ) : (
                                <ul className="mb-4">
                                    {acap.map((a) => (
                                        <li key={a.id_acap} className="flex justify-between items-center border-b py-2 dark:text-white/90">
                                            <span>
                                                <strong>{a.type.toUpperCase()}</strong> – {a.acap}
                                            </span>
                                            <button
                                                className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                                                onClick={() => deleteAction(a.id_acap)}
                                            >
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ul>

                        <div className="flex flex-col gap-2">
                            <select
                                value={newAction.type}
                                onChange={(e) => setNewAction({ ...newAction, type: e.target.value as "ac" | "ap" })}
                                className="border px-2 py-1 rounded dark:text-gray-600"
                            >
                                <option className="">Selecter un type</option>
                                <option value="ac" className="">Action Corrective</option>
                                <option value="ap" className="">Action Préventive</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

                            <input
                                type="text"
                                placeholder="Description"
                                value={newAction.acap}
                                onChange={(e) => setNewAction({ ...newAction, acap: e.target.value })}
                                className="border px-2 py-1 rounded dark:text-white/90"
                            />
                            {errors.acap && <p className="text-red-500 text-sm">{errors.acap}</p>}
                            <button
                                className="px-3 py-1 rounded bg-green-500 text-white"
                                onClick={addAction}
                                disabled={loading}
                            >
                                {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                            </button>
                        </div>

                        <button className="mt-4 text-sm dark:bg-white/60 px-2 py-1 rounded dark:hover:bg-white/40" onClick={closeModal}>
                            Fermer
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
