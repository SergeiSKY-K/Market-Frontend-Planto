import React, { type Dispatch, type SetStateAction } from "react";
import type { Product } from "./types/Product";
import type { DataTableProducts, PageProductsData } from "./types";
import type Sort from "../components/classes/Sort";
import type Filter from "../components/classes/Filter";


interface ProductsContextType {
    products: Product[];
    pages: number;
    setProductsData: Dispatch<SetStateAction<DataTableProducts>>;
}

interface PageContextType {
    pageNumber: number;
    sort: Sort;
    filters: Filter[];
    setPage: Dispatch<SetStateAction<PageProductsData>>;
}

export const ProductsContext =
    React.createContext<ProductsContextType | null>(null);

export const PageContext =
    React.createContext<PageContextType | null>(null);
