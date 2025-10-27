
    export interface Planaction {
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
        nom_departement: string;
        zone: string;
        origine: string;
        prob: string;
        cause: string;
        action: string;
        date_debut: Date;
        date_cloture: Date;
        note: string;
        responsable: string;
        support: string;
        contol_effic: string;
        annul: string;
        level: string;
        editeur:string;
        first_name?:string;
        last_name?:string;
    }