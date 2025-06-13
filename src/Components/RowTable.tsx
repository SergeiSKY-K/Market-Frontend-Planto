import {ProductsContext} from "../utils/Context.ts";
import {useContext} from "react";
import type Product from "./Product.ts";

interface PropsProduct {
    product: Product,
    updateTable: (products: Product[]) => void
}


const RowTable = (props: PropsProduct) => {

    const {products, setProducts} = useContext(ProductsContext);
    const product = props.product;

    const editProduct = (id: number) => {
        const index = products.findIndex((product) => product.id === id);
        if (index >= 0){
            return  true;
        }

        return true;
    }

    const removeProduct = (id: number) => {
        const index = products.findIndex((product) => product.id === id);
        if (index >= 0){
            const newProducts = products.filter((p) => p.id !== id);
            setProducts(newProducts);
        }
    }


    return (
        <tr className={"hover:bg-[#eec3a9] hover:text-[#cd663d]"}>
            <th className={"font-normal w-70"}>{product.name}</th>
            <th className={"font-normal w-70"}>{product.category}</th>
            <th className={"w-40"}>{product.quantity}</th>
            <th className={"w-20"}>
                {product.price}
            </th>
            <th className={"w-5 flex flex-row flex-nowrap justify-around items-center"}>
                <img src={"./src/assets/edit.jpg"} alt={"Edit"} className={"w-5"} onClick={() => editProduct(product.id)}></img>
                <img src={"./src/assets/delete.jpg"} alt={"Delete"} onClick={() => removeProduct(product.id)} className={"w-5"}></img>
            </th>
        </tr>
    )
}

export default RowTable