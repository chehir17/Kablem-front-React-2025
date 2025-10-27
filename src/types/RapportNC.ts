export interface RapportNC {
    id_rapportnc: number;
    code_artc: string;
    num_lot_date: string;
    nr_fnc?: string;
    sujet_non_conformite: string;
    qte_nc: number;
    process: string;
    nom_client: string;
    occurance_defaut: string;
    ac_immed: string;
    date_ac_immed: string;
    date_verf_ac_immed: string;
    created_at: Date;

    photo_ok?: string;
    photo_nok?: string;
    photo_idant?: string;
}