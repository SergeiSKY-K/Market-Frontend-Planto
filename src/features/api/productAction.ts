import axiosInstance from "./axiosInstance";
import { uploadProductImage } from "./imageAction";

const BASE_URL = import.meta.env.VITE_BASE_PRODUCT_URL || "/product";

export const getProductsTable = async (_p = 1, _s?: unknown, _f?: unknown) => {
    const { data } = await axiosInstance.get(BASE_URL);
    const list: any[] = Array.isArray(data) ? data : [];
    return { products: list, pages: 1 };
};

type CreatePayload = {
    name: string;
    category: string;
    quantity: number;
    price: number;
    description?: string;
    imageUrl?: string;
};

export const addProductToTable = async (
    product: { name: string; category: string; quantity: number; price: number; description?: string },
    imageFile?: Blob
) => {
    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadProductImage(imageFile, product.name);
        } catch (e) {
            console.warn("Image upload failed, continue without image", e);
        }
    }

    const payload: CreatePayload = {
        name: product.name.trim(),
        category: product.category.trim(),
        quantity: Number(product.quantity) || 0,
        price: Number(product.price) || 0,
        description: product.description?.trim() ?? "",
        ...(imageUrl ? { imageUrl } : {}),
    };

    const { data } = await axiosInstance.post(BASE_URL, payload);
    return data;
};

export const updateProduct = async (p: any) => {
    const payload = {
        name: p.name?.trim(),
        category: typeof p.category === "string" ? p.category : p.category?.name,
        quantity: Number(p.quantity) || 0,
        price: Number(p.price) || 0,
        description: p.description ?? "",
        imageUrl: p.imageUrl ?? undefined,
    };
    const { data } = await axiosInstance.put(`${BASE_URL}/${p.id}`, payload);
    return data;
};

export const deleteProduct = async (id: string | number) => {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return data;
};

export const getMyProducts = async () => {
    const { data } = await axiosInstance.get(`${BASE_URL}/my-products`);
    return data;
};

export const getBlockedProducts = async () => {
    const { data } = await axiosInstance.get(`${BASE_URL}/blocked`);
    return data;
};

export const toggleProductStatus = async (id: string, block: boolean) => {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/status`, null, {
        params: { block },
    });
    return data;
};

export const getByCategory = async (category: string) => {
    const { data } = await axiosInstance.get(`${BASE_URL}/category/${encodeURIComponent(category)}`);
    return data;
};
