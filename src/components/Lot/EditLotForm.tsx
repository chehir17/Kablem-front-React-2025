import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";
import { Lot } from "../../types/Lot";
import { Article } from "../../types/Articles";
import { LotService } from "../../services/LotService";
import { ArticleService } from "../../services/ArticleService";

interface EditLotModalProps {
    isOpen: boolean;
    onClose: () => void;
    lot: Lot | null;
    onSave: (updatedLigne: Lot) => void;
}

export default function EditLotModal({
    isOpen,
    onClose,
    lot,
    onSave,
}: EditLotModalProps) {
    const [articels, setArticels] = useState<Article[]>([]);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState({
        id_lot: 0,
        num_lot: "",
        date_prod: new Date(),
        qnt_produit: 0,
        nom_artc: ""
    });

    const [loading, setLoading] = useState(false);

    const fetchLots = async () => {
        try {
            const data = await ArticleService.getArticles();
            setArticels(data);
        } catch (err) {
            console.log("Impossible de charger les lots.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lot) {
            setFormData(lot);
        }
        fetchLots();
    }, [lot]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleSubmit = async () => {

        try {
            setLoading(true);
            const updated = await LotService.updateLot(formData.id_lot, formData);
            console.log(" la lot mis à jour :", updated);
            onSave(updated);
            swal({
                title: "succès !",
                text: " lot est à jour !",
                icon: "success",
            })
            onClose();
            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de lot !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-2">
            <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier lot N° {lot?.id_lot} de l'article {lot?.nom_artc}
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label htmlFor="num_lot">Numero du lot</Label>
                                <Input
                                    type="text"
                                    id="num_lot"
                                    onChange={handleChange}
                                    error={!!errors.num_lot} success={!!formData.num_lot}
                                    value={formData.num_lot}
                                />
                                {errors.num_lot && <p className="text-red-500 text-sm">{errors.num_lot}</p>}
                            </div>
                            <div>
                                <Label htmlFor="date_prod">Date de production</Label>
                                <DatePicker
                                    id="date_prod"
                                    label="Date de production "
                                    placeholder="Sélectionner une date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            date_prod: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                        }));
                                    }}
                                />
                                {errors.nom_artc && <p className="text-red-500 text-sm">{errors.nom_artc}</p>}
                            </div>
                            <div>
                                <Label htmlFor="qnt_produit">Numero du lot</Label>
                                <Input
                                    type="number"
                                    id="qnt_produit"
                                    onChange={handleChange}
                                    error={!!errors.qnt_produit} success={!!formData.qnt_produit}
                                    value={formData.qnt_produit}
                                />
                                {errors.qnt_produit && <p className="text-red-500 text-sm">{errors.qnt_produit}</p>}
                            </div>
                            <div>
                                <Label>Article</Label>
                                <Select
                                    options={articels.length > 0
                                        ? articels.map(dep => ({ value: String(dep.id_article), label: dep.nom_artc }))
                                        : [{ value: "", label: "Aucun article disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "id_article")}
                                    value={formData.nom_artc}
                                />
                                {errors.id_article && <p className="text-red-500 text-sm">{errors.id_article}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-0 lg:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}