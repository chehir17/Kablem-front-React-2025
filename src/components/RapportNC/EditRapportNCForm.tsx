import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import DatePicker from "../form/date-picker";
import { RapportNC } from "../../types/RapportNC";
import { Client } from "../../types/Client";
import { Article } from "../../types/Articles";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { RapportNcService } from "../../services/RapportNcService";

interface EditRapportNcModalProps {
    isOpen: boolean;
    onClose: () => void;
    rapportnc: RapportNC | null;
    onSave: (updatedRapports: RapportNC) => void;
}

export default function EditRapportNcModal({
    isOpen,
    onClose,
    rapportnc,
    onSave,
}: EditRapportNcModalProps) {
    const [formData, setFormData] = useState({
        id_rapportnc: 0,
        code_artc: "",
        num_lot_date: "",
        nr_fnc: "nc",
        sujet_non_conformite: "",
        photo_ok: "",
        photo_nok: "",
        photo_idant: "",
        qte_nc: 0,
        process: "",
        nom_client: "",
        occurance_defaut: "",
        ac_immed: "",
        date_ac_immed: new Date(),
        date_verf_ac_immed: new Date(),
    });
    const [clients, setclients] = useState<Client[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const fetchArticles = async () => {
        try {
            const data = await ArticleService.getArticles();
            setArticles(data);
        } catch (err) {
            console.log("Impossible de charger les articles.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const data = await ClientService.getClient();
            setclients(data);
        } catch (err) {
            console.log("Impossible de charger les clients.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        fetchClients();
    }, []);

    useEffect(() => {
        if (rapportnc) {
            setFormData({
                id_rapportnc: rapportnc.id_rapportnc,
                code_artc: rapportnc.code_artc || "",
                num_lot_date: rapportnc.num_lot_date || "",
                nr_fnc: rapportnc.nr_fnc || "",
                sujet_non_conformite: rapportnc.sujet_non_conformite || "",
                photo_ok: rapportnc.photo_ok ?? "",
                photo_nok: rapportnc.photo_nok ?? "",
                photo_idant: rapportnc.photo_idant ?? "",
                qte_nc: rapportnc.qte_nc ?? 0,
                process: rapportnc.process || "",
                nom_client: rapportnc.nom_client || "",
                occurance_defaut: rapportnc.occurance_defaut || "",
                ac_immed: rapportnc.ac_immed || "",
                date_ac_immed: rapportnc.date_ac_immed
                    ? new Date(rapportnc.date_ac_immed)
                    : new Date(),
                date_verf_ac_immed: rapportnc.date_verf_ac_immed
                    ? new Date(rapportnc.date_verf_ac_immed)
                    : new Date(),
            });
        }
    }, [rapportnc]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors((prev: any) => ({ ...prev, [field]: "Le fichier doit être une image." }));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev: any) => ({ ...prev, [field]: "La taille du fichier doit être inférieure à 2 Mo." }));
                return;
            }
            setFormData((prev: any) => ({ ...prev, [field]: file }));
            setErrors((prev: any) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.code_artc) newErrors.code_artc = "Le nom de l'article est requis";
        if (!formData.num_lot_date) newErrors.num_lot_date = "Le Lot est requis";
        if (!formData.sujet_non_conformite) newErrors.sujet_non_conformite = "Le sujet est requis";
        if (!formData.photo_ok) newErrors.photo_ok = "La Photo OK est requise";
        if (!formData.photo_nok) newErrors.photo_nok = "La Photo Non Ok est requise";
        if (!formData.photo_idant) newErrors.photo_idant = "La Photo Identité est requise";
        if (!formData.qte_nc) newErrors.qte_nc = "Le Quantité NC est requis";
        if (!formData.process) newErrors.process = "Le process est requis";
        if (!formData.nom_client) newErrors.nom_client = "Le nom de client est requis";
        if (!formData.occurance_defaut) newErrors.occurance_defaut = "L'occurence defaut est requise";
        if (!formData.ac_immed) newErrors.ac_immed = "L'action immediate est requise";
        if (!formData.date_ac_immed) newErrors.date_ac_immed = "La date de l'action immediate est requise";
        if (!formData.date_verf_ac_immed) newErrors.date_verf_ac_immed = "La date de verification est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("code_artc", formData.code_artc || "");
            formDataToSend.append("num_lot_date", formData.num_lot_date || "");
            formDataToSend.append("sujet_non_conformite", formData.sujet_non_conformite || "");
            formDataToSend.append("qte_nc", (formData.qte_nc ?? 0).toString());
            formDataToSend.append("process", formData.process || "");
            formDataToSend.append("nom_client", formData.nom_client || "");
            formDataToSend.append("occurance_defaut", formData.occurance_defaut || "");
            formDataToSend.append("ac_immed", formData.ac_immed || "");
            formDataToSend.append("date_ac_immed", formData.date_ac_immed?.toString() ?? "");
            formDataToSend.append("date_ac_immed", formData.date_ac_immed?.toString() ?? "");

            if (formData.photo_ok) formDataToSend.append("photo_ok", formData.photo_ok);
            if (formData.photo_nok) formDataToSend.append("photo_nok", formData.photo_nok);
            if (formData.photo_idant) formDataToSend.append("photo_idant", formData.photo_idant);


            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
            const response = await RapportNcService.update(rapportnc!.id_rapportnc, formDataToSend);
            onSave(response.data);
            onClose();
            console.log("Utilisateur créé :", response.data);
            swal({
                title: "Good job!",
                text: "Le rapport a été Modifié avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/rapport-nc";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Impossible de modifier le rapport.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const optionsProcess = [
        { value: "p1", label: "P1" },
        { value: "p2", label: "P2" },
        { value: "p3", label: "P3" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] max-h-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-auto max-h-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier Rapport N° {formData.id_rapportnc}
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="code_article">Code Article</Label>
                                <Select
                                    value={articles.find(a => a.nom_artc === formData.code_artc)?.nom_artc || ""}
                                    options={articles.map(a => ({ value: String(a.id_article), label: a.code_artc }))}
                                    onChange={(val) => handleSelectChange(val, "code_artc")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="num_lot_date">N° de Lot/ Date</Label>
                                <Input
                                    type="text"
                                    id="num_lot_date"
                                    name="num_lot_date"
                                    value={formData.num_lot_date}
                                    onChange={handleChange}
                                    className="w-full"
                                    error={!!errors.num_lot_date} success={!!formData.num_lot_date}
                                />
                            </div>
                            <div>
                                <Label htmlFor="sujet_non_conformite">Sujet de Non Conformité</Label>
                                <Input
                                    type="text"
                                    id="sujet_non_conformite"
                                    name="sujet_non_conformite"
                                    value={formData.sujet_non_conformite}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                                {errors.sujet_non_conformite && <p className="text-red-500 text-sm">{errors.sujet_non_conformite}</p>}
                            </div>
                            <div>
                                <Label>Photo OK</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "photo_ok")} className="w-full" />
                                {errors.photo_ok && <p className="text-red-500 text-sm">{errors.photo_ok}</p>}
                            </div>

                            <div>
                                <Label>Photo Non Ok</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "photo_nok")} className="w-full" />
                                {errors.photo_nok && <p className="text-red-500 text-sm">{errors.photo_nok}</p>}
                            </div>

                            <div>
                                <Label>Photo Identité</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "photo_idant")} className="w-full" />
                                {errors.photo_idant && <p className="text-red-500 text-sm">{errors.photo_idant}</p>}
                            </div>

                            <div>
                                <Label htmlFor="qte_nc">Quantité NC</Label>
                                <Input
                                    type="number"
                                    id="qte_nc"
                                    value={formData.qte_nc}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                                {errors.qte_nc && <p className="text-red-500 text-sm">{errors.qte_nc}</p>}
                            </div>

                            <div>
                                <Label>Process</Label>
                                <Select
                                    options={optionsProcess}
                                    placeholder="Sélectionner un département"
                                    onChange={(val) => handleSelectChange(val, "process")}
                                    value={formData.process}
                                    className="w-full"
                                />
                                {errors.process && <p className="text-red-500 text-sm">{errors.process}</p>}
                            </div>

                            <div>
                                <Label>Nom Client</Label>
                                <Select
                                    options={clients.length > 0
                                        ? clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                        : [{ value: "", label: "Aucun Client disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "nom_client")}
                                />
                                {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}
                            </div>

                            <div>
                                <Label htmlFor="occurance_defaut">Occurence au Défaut</Label>
                                <Input
                                    type="text"
                                    id="occurance_defaut"
                                    name="occurance_defaut"
                                    value={formData.occurance_defaut}
                                    onChange={handleChange}
                                    className="w-full"
                                    error={!!errors.occurance_defaut} success={!!formData.occurance_defaut}
                                />
                                {errors.occurance_defaut && <p className="text-red-500 text-sm">{errors.occurance_defaut}</p>}
                            </div>

                            <div>
                                <Label htmlFor="ac_immed">TRAITEMENT NC (Action Immédiate)</Label>
                                <Input
                                    type="text"
                                    id="ac_immed"
                                    name="ac_immed"
                                    value={formData.ac_immed}
                                    onChange={handleChange}
                                    className="w-full"
                                    error={!!errors.ac_immed} success={!!formData.ac_immed}
                                />
                                {errors.ac_immed && <p className="text-red-500 text-sm">{errors.ac_immed}</p>}
                            </div>

                            <div className="w-full">
                                <DatePicker
                                    id="date_ac_immed"
                                    label="Date de l'action immédiat"
                                    placeholder="Sélectionner une date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            date_ac_immed: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                        }));
                                    }}
                                />
                                {errors.date_ac_immed && <p className="text-red-500 text-sm">{errors.date_ac_immed}</p>}
                            </div>

                            <div className="w-full">
                                <DatePicker
                                    id="date_verf_ac_immed"
                                    label="Date de vérification de l'action immédiat "
                                    placeholder="Sélectionner une date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            date_verf_ac_immed: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                        }));
                                    }}
                                />
                                {errors.date_verf_ac_immed && <p className="text-red-500 text-sm">{errors.date_verf_ac_immed}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                            type="submit"
                        >
                            {loading ? "sauvegarder...⏳" : "Modifier Rapport NC"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

    );
}