import AddProduct from "./AddProduct.tsx";
import Table from "./Table.tsx";
import {useState} from "react";
import {ProductsContext} from "../utils/Context.ts";
import {Products} from "../utils/constants.ts";

const Workspace = () => {

    const [products, setProducts] = useState(Products);

    return (
        <div className={"col-span-6"}>
            <ProductsContext.Provider value={{products, setProducts}}>
                <AddProduct/>
                <Table/>
            </ProductsContext.Provider>
        </div>
    )
}

export default Workspace