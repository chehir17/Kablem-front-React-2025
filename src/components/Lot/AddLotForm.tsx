import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Article } from "../../types/Articles.ts";
import { ArticleService } from "../../services/ArticleService.tsx";
import { LotService } from "../../services/LotService.tsx";
import DatePicker from "../form/date-picker.tsx";

export default function AddLotForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [articels, setArticels] = useState<Article[]>([]);
    const [formData, setFormData] = useState<any>({
        id_lot: 0,
        num_lot: "",
        date_prod: new Date(),
        qnt_produit: 0,
        id_article: 0
    });

    const fetchArticles = async () => {
        try {
            const data = await ArticleService.getArticles();
            setArticels(data);
        } catch (err) {
            console.log("Impossible de charger les départements.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [])

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

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.num_lot) newErrors.num_lot = "Le numéro du lot est requis";
        if (!formData.date_prod) newErrors.date_prod = "La Date de production est requise";
        if (!formData.qnt_produit) newErrors.qnt_produit = "La quantité produite est requise";
        if (!formData.id_article) newErrors.id_article = "La nom de l'article est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLot = async () => {
        if (!validateForm()) return;
        try {


            console.log("📤 Données envoyées :", formData);

            const res = await LotService.createLot(formData);

            swal({
                title: "Succès !",
                text: "Le Lot a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.error("❌ Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        }
    };



    return (
        <ComponentCard title="Ajouter une lot">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="num_lot">Numero du lot</Label>
                    <Input
                        type="text"
                        id="num_lot"
                        onChange={handleChange}
                        error={!!errors.num_lot} success={!!formData.num_lot}
                    />
                    {errors.num_lot && <p className="text-red-500 text-sm">{errors.num_lot}</p>}
                </div>
                <div>
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
                    {errors.date_prod && <p className="text-red-500 text-sm">{errors.date_prod}</p>}
                </div>
                <div>
                    <Label htmlFor="qnt_produit">Quantité produite</Label>
                    <Input
                        type="number"
                        id="qnt_produit"
                        onChange={handleChange}
                        error={!!errors.qnt_produit} success={!!formData.qnt_produit}
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
                    />
                    {errors.id_article && <p className="text-red-500 text-sm">{errors.id_article}</p>}
                </div>
            </div>
            <div className="flex items-center justify-center h-full">
                <button
                    type="button"
                    onClick={handleLot}
                    className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                </button>
            </div>
        </ComponentCard>
    );
}
