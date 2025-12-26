import type { Product } from "../types/Product";
import type Sort from "../components/classes/Sort";
import type Filter from "../components/classes/Filter";
import type { ComponentType } from "react";

export interface Item {
    title: string;
    path: string;
    icon: ComponentType<never>;
}

export interface DataTableProducts {
    products: Product[];
    pages: number;
}

export interface PageProductsData {
    pageNumber: number;
    sort: Sort;
    filters: Filter[];
}
