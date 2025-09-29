import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import FileInput from "../form/input/FileInput";
import { Modal } from "../ui/modal";
import DataTable from "react-data-table-component";


interface EditSuiviClientModelProps {
    isOpen: boolean;
    onClose: () => void;
    suiviclient: {
        id_suiviclient: number;
        num_rec_cli: string;
        date_rec_cli: Date;
        zone: string;
        id_client: string | null;
        id_article: string | null;
        nom_projet: string;
        phase_projet: string;
        desc_deff: string;
        photo_ok: string;
        photo_nok: string;
        nbr_piec_ko: string;
        type_incidant: string;
        num_rec_four: string;
        recurence: string;
        statut: string;
        cout_non_quat_s_rec: string;
        level: string | null
    } | null;
    onSave: (updatesuiviclient: {
        id_suiviclient: number;
        num_rec_cli: string;
        date_rec_cli: Date;
        zone: string;
        id_client: string | null;
        id_article: string | null;
        nom_projet: string;
        phase_projet: string;
        desc_deff: string;
        photo_ok: string;
        photo_nok: string;
        nbr_piec_ko: string;
        type_incidant: string;
        num_rec_four: string;
        recurence: string;
        statut: string;
        cout_non_quat_s_rec: string;
        level: string | null
    }) => void;
}

export default function EditSuiviClientModel({
    isOpen,
    onClose,
    suiviclient,
    onSave
}: EditSuiviClientModelProps) {

    const [formData, setFormData] = useState({
        id_suiviclient: 0,
        num_rec_cli: "",
        date_rec_cli: new Date(""),
        zone: "",
        id_client: null as string | null,
        id_article: null as string | null,
        nom_projet: "",
        phase_projet: "",
        desc_deff: "",
        photo_ok: "",
        photo_nok: "",
        nbr_piec_ko: "",
        type_incidant: "",
        num_rec_four: "",
        recurence: "",
        statut: "",
        cout_non_quat_s_rec: "",
        level: null as string | null,
    });

    useEffect(() => {
        if (suiviclient) {
            setFormData(suiviclient);
        }
    }, [suiviclient]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (suiviclient) {
            onSave(formData);
            console.log("Ligne mis à jour :", formData);
            onClose();
        }
    };


    const optionsZone = [
        { value: "P1", label: "P1" },
        { value: "P2", label: "P2" },
        { value: "P3", label: "P3" },
        { value: "P1 + P2", label: "P1 + P2" },
        { value: "P1 + P2 + P3", label: "P1 + P2 + P3" },
        { value: "CET", label: "CET" },
        { value: "Magasin", label: "Magasin" },
        { value: "P3-1", label: "P3-1" },
        { value: "P3-2", label: "P3-2" },
        { value: "P3-3", label: "P3-3" },
        { value: "Usine", label: "Usine" },
    ];

    const optionsClients = [
        { value: "mostfa", label: "Mostafa" },
        { value: "hamadi", label: "Hamadi" },
    ];

    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];

    const optionsPhaseProjet = [
        { value: "Fabrication", label: "Fabrication" },
        { value: "Montage", label: "Montage" },
        { value: "Inspection", label: "Inspection" },
        { value: "Livraison", label: "Livraison" },
    ];

    const OptionsTypeincident = [
        { value: "Type de Incident", label: "Type de Incident" },
        { value: "Réclamation interne group", label: "Réclamation interne group" },
        { value: "alerte", label: "alerte" },
        { value: "Réclamation client", label: "Réclamation client" },
        { value: "Prototypes", label: "Prototypes" },
    ]

    const optionsStatut = [
        { value: "Ouvert", label: "Ouvert" },
        { value: "En cours", label: "En cours" },
        { value: "Clôturé", label: "Clôturé" },
        { value: "Annulé", label: "Annulé" },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };



    return (


        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-70">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {suiviclient ? `Modifier Suivi Client N° ${suiviclient.id_suiviclient}` : "Modifier"}
                </h4>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mr-5 mb-2">
                            <div>
                                <Label htmlFor="num_rec_cli">N° reclamation client</Label>
                                <Input
                                    type="text"
                                    id="num_rec_cli"
                                    name="num_rec_cli"
                                    onChange={handleChange}
                                    value={formData.num_rec_cli}
                                />
                            </div>
                            <div className="">
                                <DatePicker
                                    id="date_rec_cli"
                                    label="Date reclamation client"
                                    placeholder="Select a date"
                                    defaultDate={formData.date_rec_cli}
                                    onChange={(dates,) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        console.log(selectedDate);
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Select
                                    options={optionsZone}
                                    placeholder="Sélectionner une Zone"
                                    onChange={(value: string) => handleSelectChange("zone", value)}
                                    value={formData.zone}
                                />
                            </div>
                            <div>
                                <Label>Réf(code-produit)</Label>
                                <Select
                                    options={optionsCodeArticle}
                                    placeholder="Sélectionner un code"
                                    onChange={(value: string) => handleSelectChange("id_article", value)}
                                    value={formData.id_article!}
                                />
                            </div>
                            <div>
                                <Label>Projet</Label>
                                <Input
                                    type="text"
                                    id="nom_projet"
                                    name="nom_projet"
                                    onChange={handleChange}
                                    value={formData.nom_projet}
                                />
                            </div>
                            <div>
                                <Label>phase de projet</Label>
                                <Select
                                    options={optionsPhaseProjet}
                                    placeholder="Sélectionner une Phase"
                                    onChange={(value: string) => handleSelectChange("phase_projet", value)}
                                    value={formData.phase_projet}
                                />
                            </div>
                            <div>
                                <Label htmlFor="desc_deff">Description du défaut</Label>
                                <Input
                                    type="text"
                                    id="desc_deff"
                                    name="desc_deff"
                                    value={formData.desc_deff}
                                />
                            </div>
                            <div>
                                <Label>Photo OK</Label>
                                <FileInput onChange={handleFileChange} className="w-full" />
                            </div>
                            <div>
                                <Label>Photo Non Ok</Label>
                                <FileInput onChange={handleFileChange} className="w-full" />
                            </div>

                            <div>
                                <Label htmlFor="nbr_piec_ko">nombre piéce KO</Label>
                                <Input
                                    type="text"
                                    id="nbr_piec_ko"
                                    name="nbr_piec_ko"
                                    value={formData.nbr_piec_ko}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Type incident </Label>
                                <Select
                                    options={OptionsTypeincident}
                                    placeholder="Sélectionner un Type"
                                    onChange={(value: string) => handleSelectChange("type_incidant", value)}
                                    value={formData.type_incidant}
                                />
                            </div>
                            <div>
                                <Label>Numéro Reclamation fournisseur </Label>
                                <Select
                                    options={optionsClients}
                                    placeholder="Sélectionner un Fournisseur"
                                    onChange={(value: string) => handleSelectChange("num_rec_four", value)}
                                    value={formData.num_rec_four}
                                />
                            </div>
                            <div>
                                <Label>Clients </Label>
                                <Select
                                    options={optionsClients}
                                    placeholder="Sélectionner un nom"
                                    onChange={(value: string) => handleSelectChange("id_client", value)}
                                    value={formData.id_client!}
                                />
                            </div>
                            <div>

                                <Label htmlFor="recurence">Recurence</Label>
                                <Input
                                    type="text"
                                    id="recurence"
                                    name="recurence"
                                    value={formData.recurence}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cout_non_quat_s_rec">CNQ</Label>
                                <Input
                                    type="text"
                                    id="cout_non_quat_s_rec"
                                    name="cout_non_quat_s_rec"
                                    value={formData.cout_non_quat_s_rec}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Statut </Label>
                                <Select
                                    options={optionsStatut}
                                    placeholder="Sélectionner une Statut"
                                    onChange={(value: string) => handleSelectChange("statut", value)}
                                    value={formData.statut}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}