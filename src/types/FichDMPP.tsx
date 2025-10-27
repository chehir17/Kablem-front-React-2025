export interface FicheDMPP {
    id_dmpp: number;
    nom_ligne: string;
    post: string;
    code_artc: string;
    nature: string;
    zone: string;
    date_sou: Date;
    type: string;
    nom_client: string;
    cout_estimative: string;
    etat_actu: string;
    etat_modif: string;
    objectif_modif: string;
}