import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductsContext } from "../../../utils/context";
import RowProductsTable from "./RowProductsTable";
import { addToCart } from "../../../store/cartSlice";
import type { Product } from "../../../utils/types/Product";

export default function ProductsView() {
    const ctx = useContext(ProductsContext) as {
        products: Product[];
        setProductsData: React.Dispatch<
            React.SetStateAction<{ products: Product[]; pages: number }>
        >;
    };

    const { products, setProductsData } = ctx;
    const dispatch = useDispatch();

    const [sp, setSp] = useSearchParams();
    const currentCategory = sp.get("category") ?? "";

    const categories = useMemo<string[]>(() => {
        const s = new Set<string>();

        for (const p of products) {
            const cat =
                typeof p.category === "string"
                    ? p.category
                    : p.category?.name ?? "";

            if (cat) s.add(cat);
        }

        return Array.from(s).sort();
    }, [products]);

    const setCategoryParam = (v: string) => {
        const next = new URLSearchParams(sp);
        v ? next.set("category", v) : next.delete("category");
        setSp(next, { replace: true });
    };

    const handleAddToCart = (p: Product) => {
        dispatch(
            addToCart({
                id: p.id,
                name: p.name,
                price: p.price ?? 0,
                supplierLogin: p.supplierLogin ?? p.supplier?.login ?? "",
                qty: 1,
            })
        );
    };

    return (
        <div className="overflow-x-auto">
            <div className="mb-3 flex items-center gap-3">
                <label className="opacity-70">Filter by category:</label>
                <select
                    className="inputField w-56"
                    value={currentCategory}
                    onChange={(e) => setCategoryParam(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <table className="w-full table-auto">
                <tbody>
                {products.map((p: Product) => (
                    <RowProductsTable
                        key={p.id}
                        product={p}
                        onAddToCart={() => handleAddToCart(p)}
                        onSavedLocal={(np) =>
                            setProductsData((prev) => ({
                                products: prev.products.map((x) =>
                                    x.id === np.id ? np : x
                                ),
                                pages: prev.pages,
                            }))
                        }
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
