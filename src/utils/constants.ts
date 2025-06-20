import type {Item} from './types'

import {
    Home,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
} from "lucide-react";

export const navItems: Item[] = [
    {title: 'Main', path: 'main', icon: Home},
    {title: 'Products', path: 'products', icon: Package}
]

//export const BASE_URL = "https://planto-gp2i.onrender.com/product"
export const BASE_URL = "http://localhost:8080/product";