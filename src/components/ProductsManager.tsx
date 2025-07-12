import {useContext, useEffect, useState} from "react";
import {getProductsTable} from "../features/api/productAction.ts";
import {PageContext, ProductsContext} from "../utils/context.ts";
import AddProduct from "./AddProduct.tsx";
import ProductsTable from "./ProductsTable.tsx";
import type {DataTableProducts} from "../utils/types";

const ProductsManager = () => {

    const [productsData, setProductsData] = useState<DataTableProducts>({products: [], pages: 0});
    const {pageNumber, sort, filters} = useContext(PageContext);

    useEffect(() => {

        const getProducts = async () => {
            try{
                const result = await getProductsTable(pageNumber, sort, filters);
                setProductsData(result)
            } catch (error) {
                console.error(error);
            }
        }

        getProducts();
    }, [pageNumber, sort, filters])

    return (
        <div className={"col-span-6"}>
            <ProductsContext.Provider value={{
                products: productsData.products,
                pages: productsData.pages,
                setProductsData: setProductsData
            }}>
                    <AddProduct/>
                    <ProductsTable/>
            </ProductsContext.Provider>
        </div>
    )
}

export default ProductsManager