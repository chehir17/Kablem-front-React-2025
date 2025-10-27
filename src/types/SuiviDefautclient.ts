    export interface SuiviDefautClient {
        id_suiviclient: number;
        id_user:number;
        num_rec_cli: string;
        date_rec_cli: Date;
        zone: string;
        nom_client: string | null;
        ref: string | null;
        nom_projet: string;
        phase_projet: string;
        desc_deff: string;
        photo_ok: string;
        photo_nok: string;
        nbr_piec_ko: string;
        type_incidant: string;
        id_suivifournisseur: string;
        recurence: string;
        statut: string;
        cout_non_quat_s_rec: string;
    }