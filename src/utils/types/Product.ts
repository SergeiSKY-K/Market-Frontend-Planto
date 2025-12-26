export type Product = {
    id: string;
    name: string;
    category?: string | { name?: string };
    quantity?: number;
    price?: number;
    imageUrl?: string;
    description?: string;
    supplierLogin?: string;
    supplier?: { login?: string };
};