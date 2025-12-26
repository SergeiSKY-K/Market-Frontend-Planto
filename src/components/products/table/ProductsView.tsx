import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductsContext } from "../../../utils/context";
import RowProductsTable from "./RowProductsTable";
import { addToCart } from "../../../store/cartSlice";
import type { Product } from "../../../utils/types/Product.ts";

export default function ProductsView() {
    const { products, setProductsData } = useContext(ProductsContext);
    const dispatch = useDispatch();

    const [sp, setSp] = useSearchParams();
    const currentCategory = sp.get("category") ?? "";

    const categories = useMemo(() => {
        const s = new Set<string>();

        for (const p of products) {
            const cat =
                typeof p.category === "string"
                    ? p.category
                    : p.category?.name ?? "";
            if (cat) s.add(cat);
        }

        const list = Array.from(s).sort((a, b) => a.localeCompare(b));
        if (currentCategory && !list.includes(currentCategory)) {
            list.unshift(currentCategory);
        }
        return list;
    }, [products, currentCategory]);

    const setCategoryParam = (v: string) => {
        const next = new URLSearchParams(sp);
        if (v) next.set("category", v);
        else next.delete("category");
        setSp(next, { replace: true });
    };

    const handleAddToCart = (p: Product) => {
        dispatch(
            addToCart({
                id: p.id,
                name: p.name,
                price: Number(p.price) || 0,
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
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {currentCategory && (
                    <button className="action-btn" onClick={() => setCategoryParam("")}>
                        Reset
                    </button>
                )}
            </div>

            <table className="w-full table-auto">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {products.map((p) => (
                    <RowProductsTable
                        key={p.id}
                        product={p}
                        onAddToCart={() => handleAddToCart(p)}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
