import { useState, useEffect } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";

interface EditPlanActionModelProps {
    isOpen: boolean;
    onClose: () => void;
    planAction: {
        id_planaction: number;
        created_at: string;
        id_dmpp: string | null;
        id_rapportnc: string | null;
        id_scrap: string | null;
        id_suiviclient: string | null;
        id_suivifournisseur: string | null;
        id_supercontrole: string | null;
        status: string;
        progress: number;
        departement: string;
        zone: string;
        origine: string;
        prob: string;
        cause: string;
        action: string;
        date_debut: Date;
        date_cloture: Date;
        note: string;
        first_name: string;
        last_name: string;
        support: string;
        contol_effic: string;
        annul: string;
        level: string;
    } | null;
    onSave: (updatedPalnActions: {
        id_planaction: number;
        created_at: string;
        id_dmpp: string | null;
        id_rapportnc: string | null;
        id_scrap: string | null;
        id_suiviclient: string | null;
        id_suivifournisseur: string | null;
        id_supercontrole: string | null;
        status: string;
        progress: number;
        departement: string;
        zone: string;
        origine: string;
        prob: string;
        cause: string;
        action: string;
        date_debut: Date;
        date_cloture: Date;
        note: string;
        first_name: string;
        last_name: string;
        support: string;
        contol_effic: string;
        annul: string;
        level: string;
    }) => void;
}

export default function EditPlanActionModel({
    isOpen,
    onClose,
    planAction,
    onSave,
}: EditPlanActionModelProps) {
    const [formData, setFormData] = useState({
        id_planaction: 0,
        created_at: "",
        id_dmpp: null as string | null,
        id_rapportnc: null as string | null,
        id_scrap: null as string | null,
        id_suiviclient: null as string | null,
        id_suivifournisseur: null as string | null,
        id_supercontrole: null as string | null,
        status: "",
        progress: 0,
        departement: "",
        zone: "",
        origine: "",
        prob: "",
        cause: "",
        action: "",
        date_debut: new Date(),
        date_cloture: new Date(),
        note: "",
        first_name: "",
        last_name: "",
        support: "",
        contol_effic: "",
        annul: "",
        level: "",
    });

    useEffect(() => {
        if (planAction) {
            setFormData(planAction);
        }
    }, [planAction]);

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (planAction) {
            onSave(formData);
            console.log("Ligne mis à jour :", formData);
            onClose();
        }
    };



    const optionsStatut = [
        { value: "open", label: "Open" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
        { value: "canceld", label: "Canceld" },
    ];

    const departementOptions = [
        { value: "qualité", label: "Qualité" },
        { value: "dep_extrusion", label: "Département extrusion" },
        { value: "dep_cablage", label: "Département câblage" },
        { value: "dep_assemblage", label: "Département assemblage" },
    ];

    const optionsAnnulation = [
        { value: "oui", label: "Oui" },
        { value: "non", label: "Non" },
    ];

    const optionsClients = [
        { value: "mostfa", label: "Mostafa" },
        { value: "hamadi", label: "Hamadi" },
    ];

    const optionsLevel = [
        { value: "High_level", label: "High Level" },
        { value: "medium_level", label: "Medium Level" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-50">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {planAction ? `Modifier le Plan d'action N° ${planAction.id_planaction}` : "Modifier"}
                </h4>

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mr-5">

                            <div>
                                <Label>Departement</Label>
                                <Select
                                    options={departementOptions}
                                    placeholder="Sélectionner un departement"
                                    onChange={(value: string) => handleSelectChange("departement", value)}
                                    value={formData.departement}
                                />
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Input
                                    type="text"
                                    id="zone"
                                    name="zone"
                                    onChange={handleChange}
                                    value={formData.zone}
                                />
                            </div>
                            <div>
                                <Label htmlFor="origine">Origine</Label>
                                <Input
                                    type="text"
                                    id="origine"
                                    name="origine"
                                    onChange={handleChange}
                                    value={formData.origine}
                                />
                            </div>
                            <div>
                                <Label htmlFor="prob">Problémes</Label>
                                <Input
                                    type="text"
                                    id="prob"
                                    name="prob"
                                    onChange={handleChange}
                                    value={formData.prob}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cause">Cause</Label>
                                <Input
                                    type="text"
                                    id="cause"
                                    name="cause"
                                    onChange={handleChange}
                                    value={formData.cause}
                                />
                            </div>
                            <div>
                                <Label htmlFor="action">Actions</Label>
                                <Input
                                    type="text"
                                    id="action"
                                    name="action"
                                    onChange={handleChange}
                                    value={formData.action}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="date_debut"
                                    defaultDate={formData.date_debut}
                                    label="Date de début"
                                    placeholder="Select a date"
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        console.log(selectedDate);
                                    }}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    id="date_cloture"
                                    label="Date de clôture"
                                    placeholder="Select a date"
                                    defaultDate={formData.date_cloture}
                                    onChange={(dates,) => {
                                        // Récupère la première date sélectionnée (si c'est un tableau)
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        console.log(selectedDate);
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Responsable</Label>
                                <Select
                                    options={optionsClients}
                                    placeholder="Sélectionner un Responsable"
                                    onChange={(value: string) => handleSelectChange("first_name", value)}
                                    value={formData.first_name}
                                />
                            </div>
                            <div>
                                <Label htmlFor="support">Support</Label>
                                <Input
                                    type="text"
                                    id="support"
                                    name="support"
                                    onChange={handleChange}
                                    value={formData.support}
                                />
                            </div>
                            <div>
                                <Label>Controle d'efficacité</Label>
                                <Input
                                    type="text"
                                    id="contol_effic"
                                    name="contol_effic"
                                    onChange={handleChange}
                                    value={formData.contol_effic}
                                />
                            </div>
                            <div>
                                <Label>Note(date de retardement ...)</Label>
                                <Input
                                    type="text"
                                    id="note"
                                    name="note"
                                    onChange={handleChange}
                                    value={formData.note}
                                />
                            </div>
                            <div>
                                <Label>Annulation</Label>
                                <Select
                                    options={optionsAnnulation}
                                    placeholder="Sélectionner une option"
                                    onChange={(value: string) => handleSelectChange("annul", value)}
                                    value={formData.annul}
                                />
                            </div>
                            <div>
                                <Label>Level</Label>
                                <Select
                                    options={optionsLevel}
                                    placeholder="Sélectionner le level"
                                    onChange={(value: string) => handleSelectChange("level", value)}
                                    value={formData.level}
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
};

