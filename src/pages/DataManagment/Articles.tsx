import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddArticleForm from "../../components/Article/AddArticleForm";
import EditArticleModal from "../../components/Article/EditArticleModal";
import { Trash } from "../../icons";
import { Update } from "../../icons";

interface ProjectRow {
    id: number;
    code_article: string;
    nom_article: string;
    type: string;
}

const tableData: ProjectRow[] = [
    {
        id: 1,
        code_article: "CF255KLM",
        nom_article: "cause",
        type: "Produit Final",
    },
    {
        id: 2,
        code_article: "TTM7800",
        nom_article: "Cable",
        type: "Matiere Premiere",
    },
];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function Article() {
    const [articles, setArticles] = useState<ProjectRow[]>(tableData);
    const [selectedArticle, setSelectedArticle] = useState<ProjectRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<ProjectRow>[] = [
        {
            name: "Code de l'article",
            selector: (row) => row.code_article,
            sortable: true,
        },
        {
            name: "Nom de l'article",
            selector: (row) => row.nom_article,
            sortable: true,
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
            cell: (row) => (
                <Badge
                    color={
                        row.type === "Produit Final"
                            ? "success"
                            : row.type === "Matiere Premiere"
                                ? "warning"
                                : "error"
                    }
                    variant="light"
                >
                    {row.type}
                </Badge>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        <Update className="w-6 h-6 font-bold"/>
                    </button>
                    <button
                        onClick={() => alert(`Supprimer article ID: ${row.id}`)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold"/>
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (row: ProjectRow) => {
        setSelectedArticle(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedArticle: ProjectRow) => {
        setArticles((prev) =>
            prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
        );
    };

    return (
        <>
            <div>
                <PageMeta
                    title="Articles"
                    description="page de gestion des articles"
                />
                <PageBreadcrumb pageTitle="Articles" />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <DataTableLayout
                            title="Liste des Articles"
                            columns={columns}
                            data={articles}
                        />
                        <EditArticleModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            article={selectedArticle}
                            onSave={handleSave}
                        />
                    </div>

                    <div className="space-y-6 xl:col-span-1">
                        <AddArticleForm />
                    </div>
                </div>
            </div>
        </>
    );
}
