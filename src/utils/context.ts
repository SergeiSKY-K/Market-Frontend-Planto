import React, {type Dispatch, type SetStateAction } from "react";
import type { Product } from "./types/Product.ts";
import type { DataTableProducts, PageProductsData } from "./types";
import type Sort from "../components/classes/Sort";
import type Filter from "../components/classes/Filter";
import {DEFAULT_SORT} from "./constants.ts";

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
    React.createContext<ProductsContextType>({
        products: [],
        pages: 0,
        setProductsData: () => {},
    });

export const PageContext =
    React.createContext<PageContextType>({
        pageNumber: 1,
        sort: DEFAULT_SORT,
        filters: [],
        setPage: () => {},
    });
