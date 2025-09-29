import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";

interface Option {
  value: string;
  label: string;
}

interface EditArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: {
        id: number;
        code_article: string;
        nom_article: string;
        type: string;
    } | null;
    onSave: (updatedArticle: {
        id: number;
        code_article: string;
        nom_article: string;
        type: string;
    }) => void;
}

export default function EditArticleModal({
    isOpen,
    onClose,
    article,
    onSave,
}: EditArticleModalProps) {
    const [formData, setFormData] = useState({
        id: 0,
        code_article: "",
        nom_article: "",
        type: "",
    });

    const typeOptions: Option[] = [
        { value: "Matiere Premiere", label: "Matiere Premiere" },
        { value: "Produit Final", label: "Produit Final" },
    ];

    useEffect(() => {
        if (article) {
            setFormData(article);
        }
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Correction : le Select attend une fonction qui prend une string
    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, type: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        console.log("Article mis à jour :", formData);
        onClose();
    };

    const options = [
        { value: "Matiere Premiere", label: "Matiere Premiere" },
        { value: "Produit Final", label: "Produit Final" },
    ];
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier l'article
                </h4>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 mb-0">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="code_article">Code Article</Label>
                                <Input
                                    type="text"
                                    id="code_article"
                                    name="code_article"
                                    value={formData.code_article}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="nom_article">Nom d'article</Label>
                                <Input
                                    type="text"
                                    id="nom_article"
                                    name="nom_article"
                                    value={formData.nom_article}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label>Type</Label>
                                <Select
                                    options={options}
                                    placeholder="Sélectionner un type"
                                    onChange={handleSelectChange}
                                    value={formData.type}
                                />
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