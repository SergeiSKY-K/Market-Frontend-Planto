import Product from "../../components/classes/Product.ts";
import { uploadFile } from "./imageAction.ts";
import Sort from "../../components/classes/Sort.ts";
import { DATA_FOR_FILTERS, FILTER_PRICE, SIZE_PAGE } from "../../utils/constants.ts";
import axiosInstance from "./axiosInstance.ts";

interface answerTable {
    content: [];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

interface DataForFilters {
    price: number;
    categories: [];
}

export const getProductsTable = async (page: number, sort?: Sort) => {
    const URL = import.meta.env.VITE_BASE_PRODUCT_URL;

    if (!URL) throw new Error("URL not found in the settings!");
    if (!sort) sort = new Sort("NameAsc", "name", 1, "Name (from A to Z)");

    const payload = {
        page: page - 1,
        size: SIZE_PAGE,
        field: sort.field,
        direction: sort.direction
    };


    const { data } = await axiosInstance.post<answerTable>(URL, payload);

    const products: Product[] = data.content.map((p: Product) =>
        new Product(p.id, p.name, p.category, p.quantity, p.price, p.imageUrl, p.description)
    );

    await setDataForFilters();

    return { products, pages: data.page.totalPages };
};

export const addProductToTable = async (product: Product, imageFile: Blob) => {
    const BASE_URL = import.meta.env.VITE_BASE_PRODUCT_URL;
    const imageUrl = imageFile ? await uploadFile(imageFile, product.name) : "";
    const URL = BASE_URL; // endpoint: POST /product

    const payload = {
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        imageUrl,
        description: product.description,
    };

    const { data } = await axiosInstance.post(URL, payload);
    return data ? new Product(data.id, data.name, data.category, data.quantity, data.price) : null;
};

export const removeProductFromTable = async (id: string) => {
    const BASE_URL = import.meta.env.VITE_BASE_PRODUCT_URL;
    const URL = `${BASE_URL}/${id}`;
    const { data } = await axiosInstance.delete(URL);
    return data;
};

export const updateProduct = async (product: Product, imageFile: Blob) => {
    const BASE_URL = import.meta.env.VITE_BASE_PRODUCT_URL;
    const URL = `${BASE_URL}/${product.id}`; // endpoint: PUT /product/{id}

    if (imageFile.size !== 0) {
        product.imageUrl = await uploadFile(imageFile, product.name);
    }

    const payload = {
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
    };

    const { data } = await axiosInstance.put(URL, payload);
    return data;
};

export const getDataForFilters = async () => {
    const URL = `${import.meta.env.VITE_BASE_PRODUCT_URL}/filterdata`;
    const { data } = await axiosInstance.get<DataForFilters>(URL);
    return { price: data.price, categories: data.categories };
};

const setDataForFilters = async () => {
    const dataForFilters = await getDataForFilters();
    DATA_FOR_FILTERS.maxPrice = dataForFilters.price;
    DATA_FOR_FILTERS.categories = dataForFilters.categories;
    FILTER_PRICE.valueTo = dataForFilters.price;
};
