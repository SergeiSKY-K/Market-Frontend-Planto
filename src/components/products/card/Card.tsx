import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Image } from "@imagekit/react";
import ImagePopup from "../ImagePopup";
import type { Product } from "../../../utils/types/Product";

interface PropsProduct {
    product: Product;
}

interface CartItem {
    id: string;
    quantity: number;
}

export const Card = ({ product }: PropsProduct) => {
    const [productsQuantity, setQuantity] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const category =
        typeof product.category === "string"
            ? product.category
            : product.category?.name ?? "";

    const imageUrl =
        product.imageUrl ?? import.meta.env.VITE_IMAGEKIT_EMPTY_PHOTO;

    const changeQuantity = (id: string, change: number) => {
        setQuantity((prev) => {
            const index = prev.findIndex((p) => p.id === id);
            const next = [...prev];

            if (index >= 0) {
                const qty = Math.max(next[index].quantity + change, 0);
                if (qty === 0) next.splice(index, 1);
                else next[index] = { id, quantity: qty };
            } else if (change > 0) {
                next.push({ id, quantity: change });
            }

            return next;
        });
    };

    const getQuantity = (id: string) =>
        productsQuantity.find((p) => p.id === id)?.quantity ?? 0;

    return (
        <div className="border-base-form border rounded-2xl flex flex-col items-center w-80 p-2">
            <div className="flex gap-3 w-full">
                <div className="w-28 h-28">
                    <Image
                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
                        src={imageUrl}
                        alt={product.name}
                        className="rounded-full cursor-zoom-in"
                        onClick={() => setIsOpen(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <ImagePopup
                    name={product.name}
                    category={category}
                    url={imageUrl}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />

                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{product.name}</h1>
                    <h2 className="text-lg">{category}</h2>
                    <p>{product.description}</p>
                </div>
            </div>

            <p className="font-bold mt-2">Price: {product.price ?? 0}$</p>

            <div className="flex gap-2 mt-2">
                <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                <input
                    type="number"
                    min={0}
                    value={getQuantity(product.id)}
                    readOnly
                />
                <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                <button>
                    <ShoppingCart />
                </button>
            </div>
        </div>
    );
};
