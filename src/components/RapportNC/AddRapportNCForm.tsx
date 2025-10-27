import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import DatePicker from "../form/date-picker";
import { Action } from "@fullcalendar/core/internal";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import { Article } from "../../types/Articles";
import { Client } from "../../types/Client";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { RapportNcService } from "../../services/RapportNcService";
import { validateForm } from "./Validation";


export default function AddRapportNcFrom() {
    const [formData, setFormData] = useState<any>({
        id_rapportnc: 0,
        code_artc: "",
        num_lot_date: "",
        nr_fnc: "nc",
        sujet_non_conformite: "",
        qte_nc: 0,
        process: "",
        nom_client: "",
        occurance_defaut: "",
        ac_immed: "",
        date_ac_immed: "",
        date_verf_ac_immed: "",
        created_at: new Date(''),
        photo_ok: '',
        photo_nok: '',
        photo_idant: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [clients, setclients] = useState<Client[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);

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
        fetchClients();
        fetchArticles();
    }, []);

    const optionsProcess = [
        { value: "p1", label: "P1" },
        { value: "p2", label: "P2" },
        { value: "p3", label: "P3" },
    ];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateForm(formData, setErrors);
        if (!isValid) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    console.log(`Ajout à FormData → ${key}:`, value);
                    if (value instanceof Blob) {
                        formDataToSend.append(key, value);
                    } else {
                        formDataToSend.append(key, String(value));
                    }
                }
            });

            const response = await RapportNcService.createRapportNc(formDataToSend);

            console.log("Rapport créé :", response.data);
            swal({
                title: "Succès !",
                text: "Le rapport a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/rapport-nc";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur !",
                text: "Impossible d'ajouter le rapport.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>

            <ComponentCard title="Ajouter Rapport de non conformité">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="code_article">Code Article</Label>
                        <Select
                            options={articles.length > 0
                                ? articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                : [{ value: "", label: "Aucun code article disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "code_artc")}
                        />
                        {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                    </div>
                    <div>
                        <Label htmlFor="num_lot_date">N° de Lot/ Date</Label>
                        <Input
                            type="text"
                            id="num_lot_date"
                            name="num_lot_date"
                            className="w-full"
                            onChange={handleChange}
                            error={!!errors.num_lot_date} success={!!formData.num_lot_date}
                        />
                        {errors.num_lot_date && <p className="text-red-500 text-sm">{errors.num_lot_date}</p>}
                    </div>
                    <div>
                        <Label htmlFor="sujet_non_conformite">Sujet de Non Conformité</Label>
                        <Input
                            type="text"
                            id="sujet_non_conformite"
                            name="sujet_non_conformite"
                            className="w-full"
                            onChange={handleChange}
                            error={!!errors.sujet_non_conformite} success={!!formData.sujet_non_conformite}
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
                            type="text"
                            id="qte_nc"
                            name="qte_nc"
                            className="w-full"
                            onChange={handleChange}
                            error={!!errors.qte_nc} success={!!formData.qte_nc}
                        />
                        {errors.qte_nc && <p className="text-red-500 text-sm">{errors.qte_nc}</p>}
                    </div>
                    <div>
                        <Label>Process</Label>
                        <Select
                            options={optionsProcess}
                            placeholder="Sélectionner un process"
                            onChange={(val) => handleSelectChange(val, "process")}
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
                            className="w-full"
                            onChange={handleChange}
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
                            className="w-full"
                            onChange={handleChange}
                            error={!!errors.ac_immed} success={!!formData.ac_immed}
                        />
                        {errors.ac_immed && <p className="text-red-500 text-sm">{errors.ac_immed}</p>}
                    </div>
                    <div className="w_full">
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
                    <div className="w_full">
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
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={(e) => handleSubmit(e)}
                        disabled={loading}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        {loading ? "Ajout...⏳" : "Ajouter Rapport NC"}
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}