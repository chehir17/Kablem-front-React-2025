export interface Ligne {
    id_ligne: number;
    nom_ligne: string;
    ref: string;
    departement: string;
    cap_production: number;
    responsable: string,
    Date_maintenance: Date,
    proch_entretien: Date,
    status: string,
}