import type { ComponentType } from "react";
import type Sort from "../components/classes/Sort.ts";

export interface Item {
    title: string;
    path: string;
    icon: ComponentType<any>;
}


export interface DataTableProducts{
    products: Product[],
    pages: number
}

export interface PageProductsData{
    pageNumber: number;
    sort: Sort;
    filters: Filter[]
}

