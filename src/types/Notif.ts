export interface Notif {
    id_notif: number;
    titre: string;
    body: string;
    visibility: number;
    created_at: Date;
    id_user?:number;
    departement?:number;
}
