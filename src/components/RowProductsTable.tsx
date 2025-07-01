import {PageContext, ProductsContext} from "../utils/context.ts";
import {useContext, useState} from "react";
import Product from "./Product.ts";
import {getProductsTable, removeProductFromTable, updateProduct} from "../features/api/productAction.ts";
import {SquarePen, Trash2, SquareCheckBig, SquareX} from "lucide-react";
import {EMPTY_PHOTO} from "../utils/constants.ts";

interface PropsProduct {
    product: Product,
}

const RowProductsTable = (props: PropsProduct) => {

    const {products, pages, setProductsData} = useContext(ProductsContext);
    const {pageNumber, sort} = useContext(PageContext);

    const [idEditProduct, setIdEditProduct] = useState("");
    const [nameProduct, setName] = useState(props.product.name);
    const [category, setCategory] = useState(props.product.category);
    const [qty, setQty] = useState(props.product.quantity);
    const [price, setPrice] = useState(props.product.price);
    const [imageUrl, setImageUrl] = useState(props.product.imageUrl);
    const [description, setDescription] = useState(props.product.description);

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
            setProductsData(await getProductsTable(pageNumber, sort));
        }
    }

    const saveChanges = async (id: string) => {
        const updProduct = new Product(id, nameProduct, category, qty, price, imageUrl, description);
        const res = await updateProduct(updProduct);
        setIdEditProduct("");
        if (res) {
            setProductsData(await getProductsTable(pageNumber, sort));
        }
    }

    const cancelChanges = () => {
        setIdEditProduct("");
    }

    // TODO - make handlers for press button Enter / Esc
    // const handleKeyWhenEdit = (e: React.KeyboardEvent<SVGSVGElement>, id: string) => {
    //     if (e.code != "Enter") {
    //         return;
    //     }
    //     editProduct(id);
    // }
    //
    // const handleKeyWhenSave = (e: React.KeyboardEvent<SVGSVGElement>) => {
    //     if (e.code != "Enter" || !idEditProduct) {
    //         alert(e.code)
    //         return;
    //     }
    //     saveChanges(idEditProduct);
    // }

    const fieldName = <input id={`name_${product.id}`} className={"inputFieldTable"}
                             value={nameProduct} onChange={(e) => setName(e.target.value)}/>
    const fieldCategory = <input id={`category_${product.id}`} className={"inputFieldTable"}
                             value={category} onChange={(e) => setCategory(e.target.value)}/>
    const fieldQty = <input id={`qty_${product.id}`} type={"number"} min={0} className={"inputFieldTable w-34"}
                            value={qty} onChange={(e) => setQty(Number.parseInt(e.target.value))}/>
    const fieldPrice = <input id={`price_${product.id}`} type={"number"} step={"0.01"} min={0} className={"inputFieldTable w-14"}
                            value={price} onChange={(e) => setPrice(Number.parseFloat(e.target.value))}/>
    const fieldDescription = <textarea rows={3} id={`description_${product.id}`} className={"inputFieldTable h-16 w-full mt-3"}
                              value={description} onChange={(e) => setDescription(e.target.value)}/>
    return (
        <tr className={"hover:bg-light-orange hover:text-alt-text"}>
            <th className={"w-20 h-20 align-top"}><img src={imageUrl ? imageUrl : EMPTY_PHOTO} alt={product.name}
                                             className={"rounded-full"}/></th>
            <th className={"pl-2 font-normal w-70"}>{idEditProduct == product.id ? fieldName : product.name}</th>
            <th className={"font-normal w-70"}>{idEditProduct == product.id ? fieldCategory : product.category}</th>
            <th className={"pl-2 w-40"}>{idEditProduct == product.id ? fieldQty : product.quantity}</th>
            <th className={"pl-2 w-20"}>{idEditProduct == product.id ? fieldPrice : product.price}</th>
            <th className={"pl-2 font-normal w-70"}>{idEditProduct == product.id ? fieldDescription : product.description}</th>
            <th className={"pl-2 text-color-base-text"}>
                <div className={"flex flex-row justify-start space-x-1"}>
                    <SquarePen onClick={() => editProduct(product.id)} className={`${idEditProduct == product.id ? 'hidden' : ''} cursor-pointer`}/>
                    <Trash2 onClick={() => removeProduct(product.id)} className={`${idEditProduct == product.id ? 'hidden' : ''} cursor-pointer`}/>
                    <SquareCheckBig onClick={() => saveChanges(product.id)} className={`${idEditProduct == product.id ? '' : 'hidden'} cursor-pointer`}/>
                    <SquareX onClick={() => cancelChanges()} className={`${idEditProduct == product.id ? '' : 'hidden'} cursor-pointer`}/>
                </div>
            </th>

        </tr>
    )
}

export default RowProductsTable