import { useContext } from "react";
import { ProductsContext } from "../../../utils/context";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import { ShoppingCart } from "lucide-react";

type AnyProduct = {
    id: string | number;
    name: string;
    price: number;
    quantity?: number;
    description?: string;
    category?: { name?: string } | string;
    imageUrl?: string;
    image?: string;
    photoUrl?: string;
    supplierLogin?: string;
    supplier?: { login?: string };
};

export default function ProductsCards() {
    const { products } = useContext(ProductsContext) as { products: AnyProduct[] };
    const dispatch = useDispatch();

    return (
        <div className="grid gap-5 mt-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {products.map((p) => {
                const category =
                    typeof p.category === "string" ? p.category : p.category?.name ?? "";
                const img = p.imageUrl ?? p.image ?? p.photoUrl ?? "";
                const supplierLogin = p.supplierLogin ?? p.supplier?.login ?? "";

                return (
                    <div
                        key={String(p.id)}
                        className="rounded-xl border border-[var(--color-base-text)] bg-[var(--color-base-bg)]/60 shadow-sm overflow-hidden"
                    >
                        {img ? (
                            <img src={img} alt={p.name} className="w-full h-64 object-cover" />
                        ) : (
                            <div className="w-full h-64 bg-[var(--color-light-green)]/30" />
                        )}

                        <div className="p-4 space-y-1">
                            <div className="text-lg font-medium text-[var(--color-base-text)]">{p.name}</div>
                            <div className="text-sm opacity-70">{category}</div>

                            <div className="text-sm">Qty: {p.quantity ?? "-"}</div>
                            <div className="text-base font-semibold">Price: {Number(p.price) || 0}</div>

                            {p.description && <div className="text-sm opacity-80">{p.description}</div>}

                            <div className="pt-2">
                                <button
                                    className="action-btn w-full gap-2"
                                    title="Add to cart"
                                    onClick={() =>
                                        dispatch(
                                            addToCart({
                                                id: String(p.id),
                                                name: String(p.name),
                                                price: Number(p.price) || 0,
                                                supplierLogin,
                                                qty: 1,
                                            })
                                        )
                                    }
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
