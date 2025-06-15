import AddProduct from "./AddProduct.tsx";
import ProductsTable from "./ProductsTable.tsx";
import {useEffect, useState} from "react";
import {ProductsContext} from "../utils/Context.ts";
import {getProductsTable} from "../features/api/productAction.ts";
import Product from "./Product.ts";

const Workspace = () => {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {

        const getProducts = async () => {
            try{
                const result = await getProductsTable();
                setProducts(result)
            } catch (error) {
                console.error(error);
            }
        }

        getProducts();
    }, [])

    return (
        <div className={"col-span-6"}>
            <ProductsContext.Provider value={{products, setProducts}}>
                <AddProduct/>
                <ProductsTable/>
            </ProductsContext.Provider>
        </div>
    )
}

export default Workspace