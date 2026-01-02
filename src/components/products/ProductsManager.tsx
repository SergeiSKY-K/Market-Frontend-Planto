import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsTable, getByCategory } from "../../features/api/productAction";
import { PageContext, ProductsContext } from "../../utils/context";
import AddProduct from "../AddProduct";
import ProductsView from "./table/ProductsView";
import type { DataTableProducts } from "../../utils/types";

const ProductsManager = () => {
    const [productsData, setProductsData] = useState<DataTableProducts>({ products: [], pages: 0 });
    const { pageNumber, sort, filters } = useContext(PageContext);

    const [sp] = useSearchParams();
    const categoryParam = (sp.get("category") ?? "").trim();

    useEffect(() => {
        const load = async () => {
            try {
                if (categoryParam) {
                    const list = await getByCategory(categoryParam);
                    const products = Array.isArray(list) ? list : [];
                    setProductsData({ products, pages: 1 });
                } else {
                    const result = await getProductsTable(pageNumber, sort, filters);
                    setProductsData(result);
                }
            } catch (error) {
                console.error(error);
            }
        };
        load();
    }, [pageNumber, sort, filters, categoryParam]);

    return (
        <div className="col-span-6">
            <ProductsContext.Provider value={{ products: productsData.products, pages: productsData.pages, setProductsData }}>
                <AddProduct />

                <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                        backgroundImage: "url(/products-bg.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="backdrop-blur-sm bg-white/80 rounded-lg p-4">
                        <ProductsView />
                    </div>
                </div>
            </ProductsContext.Provider>

        </div>
    );
};

export default ProductsManager;
