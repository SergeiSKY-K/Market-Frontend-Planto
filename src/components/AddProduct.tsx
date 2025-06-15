import {useContext, useState} from "react";
import Product from "./Product.ts";
import {ProductsContext} from "../utils/Context.ts";

const AddProduct = () => {

    const [nameProduct, setName] = useState("");
    const [category, setCategory] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const {products, setProducts} = useContext(ProductsContext);

    const addProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct = new Product(getNewId(), nameProduct, category, qty, price);
        setProducts(prevProducts => [...prevProducts, newProduct]);
    }

    function getNewId(): number {
        if (products.length == 0) {
            return 10;
        }
        const copy = products.slice(0, products.length).sort((a, b) => a.id - b.id);
        return copy[copy.length - 1].id + 10;
    }

    return (
        <form className={"text-alt-text-color"} onSubmit={addProduct}>
            <h2 className={'text-alt-text-color'}>Add new product:</h2>
            {/*TODO change to components    */}
            <label className={"text-base-text-color"}>Name:
                <input type={"text"} id={"name"} required={true} onChange={(e) => setName(e.target.value)}
                       className={"border-light-green border-2 text-base-text-color"}></input>
            </label>
            <label className={"text-base-text-color"}>Category:
                <input type={"text"} id={"category"} required={true} onChange={(e) => setCategory(e.target.value)}
                       className={"border-light-green border-2 text-base-text-color"}></input>
            </label>
            <label className={"text-base-text-color"}>Quantity:
                <input type={"number"} id={"qty"} onChange={(e) => setQty(Number(e.target.value))}
                       className={"border-light-green border-2 text-base-text-color"}></input>
            </label>
            <label className={"text-base-text-color"}>Price:
                <input type={"number"} id={"price"} onChange={(e) => setPrice(Number(e.target.value))}
                       className={"border-light-green border-2 text-base-text-color"}></input>
            </label>
            <button type={"submit"} className={"bg-[#405443] text-[#9dbfab] w-20 border-2 hover:bg-[#57805bff]"}>Add</button>
        </form>
    )
}

export default AddProduct