import RowTable from "./RowTable.tsx";
import type Product from "./Product.ts";
import {Products} from "../utils/constants.ts";

interface propsTable{
    products: Product[];
}

const Table = (props: propsTable) => {
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
                {Products.map(product => <RowTable key={product.id} product={product} />)}
            </tbody>
        </table>
    )
}

export default Table