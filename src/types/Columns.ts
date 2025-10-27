import { JSX } from "react";

    export interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
        hidden?: boolean;

    }