export interface Stock {
    id_stock: number;
    id_article: number;
    id_lot?: number;
    quantite_disponible: number;
    seuil_min: number;
    seuil_max?: number;
    created_at: string;
    updated_at: string;
    article?: {
        id_article: number;
        code_artc: string;
        nom_artc: string;
    };
    lot?: {
        id_lot: number;
        nom_lot: string;
    };
}

export interface MouvementStock {
    id_mouvement_stock: number;
    id_article: number;
    type_mouvement: 'ENTREE' | 'SORTIE';
    quantite: number;
    source?: string;
    reference_doc?: string;
    created_at: string;
}