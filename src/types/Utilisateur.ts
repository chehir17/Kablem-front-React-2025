export interface Utilisateur {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
    matricul: string;
    nature: string,
    id_departement: string,
    role?: string,
    level?: string,
    password:string,
    statut: string,
    photo: string,
    zone: string
}