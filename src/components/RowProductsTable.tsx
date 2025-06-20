import {ProductsContext} from "../utils/Context.ts";
import {useContext, useState} from "react";
import Product from "./Product.ts";
import {getProductsTable, removeProductFromTable, updateProduct} from "../features/api/productAction.ts";

interface PropsProduct {
    product: Product,
}

const RowProductsTable = (props: PropsProduct) => {

    const {products, setProducts} = useContext(ProductsContext);
    const [idEditProduct, setIdEditProduct] = useState("");

    const [nameProduct, setName] = useState(props.product.name);
    const [category, setCategory] = useState(props.product.category);
    const [qty, setQty] = useState(props.product.quantity);
    const [price, setPrice] = useState(props.product.price);

    const product = props.product;


    const editProduct = (id: string) => {
        const index = products.findIndex((product) => product.id === id);
        if (index >= 0){
            setIdEditProduct(id);
        }
    }

    const removeProduct = async (id: string) => {
        const res = await removeProductFromTable(id);
        if (res){
            setProducts(await getProductsTable());
        }
    }

    const saveChanges = async (id: string) => {
        const updProduct = new Product(id, nameProduct, category, qty, price);
        const res = await updateProduct(updProduct);
        setIdEditProduct("");
        if (res) {
            setProducts(await getProductsTable());
        }
    }

    const cancelChanges = () => {
        setIdEditProduct("");
    }

    const fieldName = <input id={`name_${product.id}`}
                             className={"border-base-form border-2 text-base-text hover:bg-base-bg"}
                             value={nameProduct} onChange={(e) => setName(e.target.value)}/>
    const fieldCategory = <input id={`category_${product.id}`}
                             className={"border-base-form border-2 text-base-text hover:bg-base-bg"}
                             value={category} onChange={(e) => setCategory(e.target.value)}/>
    const fieldQty = <input id={`qty_${product.id}`} type={"number"}
                            className={"border-base-form border-2 text-base-text hover:bg-base-bg"}
                            value={qty} onChange={(e) => setQty(Number.parseInt(e.target.value))}/>
    const fieldPrice = <input id={`price_${product.id}`} type={"number"} size={0.01}
                            className={"border-base-form border-2 text-base-text hover:bg-base-bg"}
                            value={price} onChange={(e) => setPrice(Number.parseFloat(e.target.value))}/>

    return (
        <tr className={"hover:bg-light-orange hover:text-alt-text"}>
            <th className={"font-normal w-70"}>{idEditProduct == product.id ? fieldName : product.name}</th>
            <th className={"font-normal w-70"}>{idEditProduct == product.id ? fieldCategory : product.category}</th>
            <th className={"w-40"}>{idEditProduct == product.id ? fieldQty : product.quantity}</th>
            <th className={"w-20"}>{idEditProduct == product.id ? fieldPrice : product.price}</th>
            <th className={"w-5 flex flex-row flex-nowrap justify-around items-center"}>
                <img src={"./src/assets/edit.jpg"} alt={"Edit"}
                     className={`w-5 ${idEditProduct == product.id ? 'invisible' : ''}`}
                     onClick={() => editProduct(product.id)}></img>
                <img src={"./src/assets/delete.jpg"} alt={"Delete"} onClick={() => removeProduct(product.id)}
                     className={`w-5 ${idEditProduct == product.id ? 'invisible' : ''}`}></img>
                <img src={"./src/assets/save.png"} alt={"Save"}
                     className={`w-5 ${idEditProduct == product.id ? '' : 'invisible'}`}
                     onClick={() => saveChanges(product.id)}></img>
                <img src={"./src/assets/cancel.png"} alt={"Cancel"} onClick={() => cancelChanges()}
                     className={`w-5 ${idEditProduct == product.id ? '' : 'invisible'}`}></img>
            </th>
        </tr>
    )
}

export default RowProductsTable