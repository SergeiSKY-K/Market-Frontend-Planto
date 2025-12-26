import axiosInstance from "./axiosInstance";
import { uploadFile } from "./fileApi.ts";

const BASE_URL = "/products";

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
    fileId?: string;
};

export const addProductToTable = async (
    product: { name: string; category: string; quantity: number; price: number; description?: string },
    imageFile?: Blob
) => {
    let imageUrl: string | undefined;
    let fileId: string | undefined;

    if (imageFile && imageFile.size > 0) {
        try {
            const up = await uploadFile(imageFile, product.name);
            imageUrl = up.url;
            fileId = up.fileId;
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
        ...(fileId ? { fileId } : {}),
    };

    const { data } = await axiosInstance.post(BASE_URL, payload);
    return data;
};

type UpdateArgs = {
    id: string | number;
    name?: string;
    category?: string | { name?: string };
    quantity?: number;
    price?: number;
    description?: string;
    imageUrl?: string;
    newImageFile?: File | Blob | null;
    newImageFileName?: string | number;
};

export const updateProduct = async (p: UpdateArgs) => {
    let imageUrl = p.imageUrl ?? undefined;
    let fileId: string | undefined;

    if (p.newImageFile) {
        const up = await uploadFile(
            p.newImageFile,
            p.newImageFileName ?? p.id ?? "product"
        );
        imageUrl = up.url;
        fileId = up.fileId;
    }

    const payload: any = {
        name: p.name?.trim(),
        category: typeof p.category === "string" ? p.category : p.category?.name,
        quantity: typeof p.quantity === "number" ? p.quantity : undefined,
        price: typeof p.price === "number" ? p.price : undefined,
        description: p.description ?? undefined,
        imageUrl,
        ...(fileId ? { fileId } : {}),
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
