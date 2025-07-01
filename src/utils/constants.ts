import type {Item} from './types'

import {
    Home,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
} from "lucide-react";
import Sort from "../components/Sort.ts";
import {directions} from "./enums/directions.ts";

export const navItems: Item[] = [
    {title: 'Main', path: 'main', icon: Home},
    {title: 'Products', path: 'products', icon: Package}
]

export const SIZE_PAGE = 5;
export const DEFAULT_SORT = new Sort("NameAsc","name", directions.Ascending, "Name (from A to Z)");
export const paramsOfSorts = [
    DEFAULT_SORT,
    new Sort("NameDesc", "name", directions.Descending, "Name (from Z to A)"),
    new Sort("PriceAsc","price", directions.Ascending, "Price (from low to high)"),
    new Sort("PriceDesc","price", directions.Descending, "Price (from high to low)"),
]

import emptyPhoto from "../assets/empty-foto.jpg";
export const EMPTY_PHOTO = emptyPhoto;
