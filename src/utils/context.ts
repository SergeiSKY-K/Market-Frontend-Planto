import React, { type Dispatch, type SetStateAction } from "react";
import type { Product } from "./types/product.ts";
import type { DataTableProducts, PageProductsData } from "./types";
import type Sort from "../components/classes/Sort";
import type Filter from "../components/classes/Filter";
import { DEFAULT_SORT } from "./constants";

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

export const ProductsContext = React.createContext<ProductsContextType>({
    products: [] as Product[], // 🔥 ВАЖНО: убивает never[]
    pages: 0,
    setProductsData: () => {
        throw new Error("ProductsContext: setProductsData is not provided");
    },
});

export const PageContext = React.createContext<PageContextType>({
    pageNumber: 1,
    sort: DEFAULT_SORT,
    filters: [] as Filter[],
    setPage: () => {
        throw new Error("PageContext: setPage is not provided");
    },
});
