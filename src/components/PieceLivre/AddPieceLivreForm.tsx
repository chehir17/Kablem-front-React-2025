import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import DatePicker from "../form/date-picker.tsx";
import GoBackButton from "../../utils/GoBack.tsx";
import { useEffect, useState } from "react";
import { Client } from "../../types/Client.ts";
import { Fournisseur } from "../../types/Fournisseur.ts";
import { ClientService } from "../../services/ClientService.tsx";
import { FournisseurService } from "../../services/FournisseurService.tsx";
import { PieceLivreService } from "../../services/PieceLivreService.tsx";



export default function AddPieceLivreForm() {
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [formData, setFormData] = useState<any>({
        id_piece: 0,
        id_client: "",
        p1_p2: "",
        p3: "",
        id_fournisseur: "",
        month: "",
    });

    const fetchclients = async () => {
        try {
            const data = await ClientService.getClient();
            setClients(data);
        } catch (err) {
            console.log("Impossible de charger les clients.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFournisseurs = async () => {
        try {
            const data = await FournisseurService.getFournisseur();
            setFournisseurs(data);
        } catch (err) {
            console.log("Impossible de charger les Fournisseurs.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchclients();
        fetchFournisseurs();
    }, []);


    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const options = [
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ];

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.id_client) newErrors.id_client = "Le nom du client est requis";
        if (!formData.p1_p2) newErrors.p1_p2 = " P1_P2 est requise";
        if (!formData.p3) newErrors.p3 = "La capacité de production est requise";
        if (!formData.id_fournisseur) newErrors.id_fournisseur = "Le nom de fournisseur est requis";
        if (!formData.month) newErrors.month = "La mois est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePiece = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log("📤 Données envoyées :", formData);

            const res = await PieceLivreService.createPieceLivre(formData);

            swal({
                title: "Succès !",
                text: "La Piece été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/pieces-livrees";
            });
        } catch (err) {
            console.error("Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <PageMeta
                    title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                    description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                />
                <div className="flex items-center justify-between mb-1">
                    <GoBackButton />
                    <PageBreadcrumb pageTitle="" />
                </div>
                <ComponentCard title="Ajouter une Pièce Livrée">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="input">Piéce livré client</Label>
                            <Select
                                options={clients.length > 0
                                    ? clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                    : [{ value: "", label: "Aucun client disponible" }]
                                }
                                placeholder={loading ? "Chargement..." : "Sélectionner"}
                                onChange={(val) => handleSelectChange(val, "id_client")}
                            />
                            {errors.id_client && <p className="text-red-500 text-sm">{errors.id_client}</p>}
                        </div>
                        <div>
                            <Label htmlFor="p1_p2">Piéce livré P1_P2</Label>
                            <Input
                                type="number"
                                id="p1_p2"
                                onChange={handleChange}
                                error={!!errors.p1_p2}
                                success={!!formData.p1_p2}
                            />
                            {errors.p1_p2 && <p className="text-red-500 text-sm">{errors.p1_p2}</p>}
                        </div>
                        <div>
                            <Label htmlFor="p3">Piéce livré P3</Label>
                            <Input
                                type="number"
                                id="p3"
                                onChange={handleChange}
                                error={!!errors.p3}
                                success={!!formData.p3}
                            />
                            {errors.p3 && <p className="text-red-500 text-sm">{errors.p3}</p>}
                        </div>
                        <div>
                            <Label htmlFor="responsable">Piéce livré Fournisseur </Label>
                            <Select
                                options={fournisseurs.length > 0
                                    ? fournisseurs.map(dep => ({ value: String(dep.id_fournisseur), label: dep.nom_fournisseur }))
                                    : [{ value: "", label: "Aucun fournisseur disponible" }]
                                }
                                placeholder={loading ? "Chargement..." : "Sélectionner"}
                                onChange={(val) => handleSelectChange(val, "id_fournisseur")}
                            />
                            {errors.id_fournisseur && <p className="text-red-500 text-sm">{errors.id_fournisseur}</p>}
                        </div>
                    </div>
                    <div>
                        <Label>Mois</Label>
                        <Select
                            options={options}
                            placeholder="Selecter une mois"
                            onChange={(val) => handleSelectChange(val, "month")}
                            className="dark:bg-dark-900"
                        />
                        {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <button
                            type="button"
                            onClick={handlePiece}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                        </button>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
