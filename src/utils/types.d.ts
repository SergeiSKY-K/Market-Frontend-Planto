import type { Product } from "../types/Product";
import type Sort from "../components/classes/Sort";
import type Filter from "../components/classes/Filter";

export interface DataTableProducts {
    products: Product[];
    pages: number;
}

export interface PageProductsData {
    pageNumber: number;
    sort: Sort;
    filters: Filter[];
}
