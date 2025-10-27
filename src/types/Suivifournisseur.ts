    export interface Suivifournisseur {
        id_suivifournisseur: number;
        created_at: Date;
        code_artc: string;
        nom_fournisseur: string;
        class: string;
        desc_prob: string;
        pcs_ko_detecte: number;
        triage: string;
        tot_pcs_ko: number;
        decision: string;
        derogation: string;
        cout_tret: number;
        statut: string;
        notes: string;
        piece_joint: string;
    }