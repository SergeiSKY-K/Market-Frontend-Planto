// src/utils/constants.ts
import type { Item } from "./types";
import { Home, Package, Shield, User, Users } from "lucide-react";
import Sort from "../components/classes/Sort";
import { directions } from "./enums/directions";
import emptyPhoto from "../assets/empty-foto.jpg";
import Filter from "../components/classes/Filter";
import { filterTypes } from "./enums/filterTypes";
import type { Dispatch, SetStateAction } from "react";

// базовое меню (для любого залогиненного)
export const baseNavItems: Item[] = [
    { title: "Main",     path: "",         icon: Home },     // "" => "/"
    { title: "Products", path: "products", icon: Package },
    { title: "Profile",  path: "profile",  icon: User },
];

// только модератор/админ
export const modOnlyItems: Item[] = [
    { title: "Suppliers", path: "suppliers", icon: Users },
];

// только админ
export const adminOnlyItems: Item[] = [
    { title: "Users", path: "admin/users", icon: Shield },
];

export const SIZE_PAGE = 8;
export const DEFAULT_SORT = new Sort("NameAsc","name", directions.Ascending, "Name (from A to Z)");
export const paramsOfSorts = [
    DEFAULT_SORT,
    new Sort("NameDesc", "name", directions.Descending, "Name (from Z to A)"),
    new Sort("PriceAsc", "price", directions.Ascending, "Price (from low to high)"),
    new Sort("PriceDesc", "price", directions.Descending, "Price (from high to low)"),
];

export const EMPTY_PHOTO = emptyPhoto;

export const FILTER_NAME = new Filter("name", filterTypes.like, "string", "");
export const FILTER_CATEGORY = new Filter("category", filterTypes.in, "string", undefined, undefined, undefined, []);
export const FILTER_PRICE = new Filter("price", filterTypes.range, "double", undefined, 0, 0);
export const DATA_FOR_FILTERS = { maxPrice: 0, categories: [] };

export interface FILTER_PROPS {
    filter: Filter;
    setFilter: Dispatch<SetStateAction<Filter>>;
}

export { baseNavItems as navItems };
