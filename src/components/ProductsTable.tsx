import RowTable from "./RowTable.tsx";
import {useContext} from "react";
import {ProductsContext} from "../utils/Context.ts";
import type Product from "./Product.ts";

const Table = () => {

    const {products, setProducts} = useContext(ProductsContext);

    const updateTable = (products: Product[]) => {
        setProducts(products);
    }

    return (

        <table className={"text-light-green"}>
            <caption>List of products</caption>
            <thead className={"border-y-2 border-base-text-color"}>
            {/*    TODO change to fields from class Product*/}
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => <RowTable key={product.id} product={product} updateTable={updateTable} />)}
            </tbody>
        </table>
    )
}

export default Table