import { useContext, useEffect, useState } from "react";
import { PageContext, ProductsContext } from "../utils/context";
import { getProductsTable, addProductToTable } from "../features/api/productAction";
import { EMPTY_PHOTO } from "../utils/constants";

const AddProduct = () => {
    const EMPTY_FILE = new File([], "", { type: "image/jpg" });

    const [nameProduct, setName] = useState("");
    const [category, setCategory] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [imageFile, setImage] = useState<File>(EMPTY_FILE);
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");

    const { setProductsData } = useContext(ProductsContext);
    const { pageNumber, sort, filters } = useContext(PageContext);

    useEffect(() => {
        if (imageFile && imageFile.size > 0) {
            const fr = new FileReader();
            fr.readAsDataURL(imageFile);
            fr.onloadend = () => fr.result && setImageUrl(fr.result as string);
        } else {
            setImageUrl("");
        }
    }, [imageFile]);

    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        await addProductToTable(
            {
                name: nameProduct,
                category,
                quantity: qty,
                price,
                description,
            },
            imageFile.size > 0 ? imageFile : undefined
        );

        // очистка формы
        setName("");
        setCategory("");
        setPrice(0);
        setQty(0);
        setImage(EMPTY_FILE);
        setImageUrl("");
        setDescription("");

        // перезагружаем список
        const updated = await getProductsTable(pageNumber, sort, filters);
        setProductsData(updated);
    };

    const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const f = event.target.files?.[0];
        if (f) setImage(f);
    };

    return (
        <form onSubmit={addProduct}>
            <h1 className="text-base-form">Add new product:</h1>
            <div className="flex flex-row justify-between align-top w-170">
                <div className="flex flex-col place-items-stretch w-2/3">
                    <label className="label flex">Name:
                        <input className="inputField ml-8 mt-1 w-full" required
                               value={nameProduct} onChange={e => setName(e.target.value)} />
                    </label>

                    <label className="label flex">Category:
                        <input className="inputField ml-2.5 w-full" required
                               value={category} onChange={e => setCategory(e.target.value)} />
                    </label>

                    <label className="label flex">Quantity:
                        <input className="inputField ml-3 w-full" type="number" min={0}
                               value={qty === 0 ? "" : qty}
                               onChange={e => setQty(Number(e.target.value))} />
                    </label>

                    <label className="label flex">Price:
                        <input className="inputField ml-9.5 w-full" type="number" step="0.01" min={0}
                               value={price === 0 ? "" : price}
                               onChange={e => setPrice(Number(e.target.value))} />
                    </label>

                    <label className="block text-base-form">Description:</label>
                    <textarea className="inputField" rows={5}
                              value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div>
                    <div className="flex flex-col justify-start">
                        <img src={imageUrl || EMPTY_PHOTO} alt="Picture"
                             className="mt-1 w-50 h-50 border-base-form border-1" />
                        <label className="flex button items-center justify-center w-50 h-10">
                            Download image
                            <input type="file" accept="image/*" className="hidden" onChange={handleSelectFile} />
                        </label>
                    </div>
                    <button type="submit" className="button w-50 h-10 mt-5">Add product</button>
                </div>
            </div>
        </form>
    );
};

export default AddProduct;
