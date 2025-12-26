import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductsContext } from "../../../utils/context";
import RowProductsTable from "./RowProductsTable";
import { addToCart } from "../../../store/cartSlice";

type ProductLike = {
    id: string | number;
    name: string;
    category?: unknown;
    price?: number;
    supplierLogin?: string;
    supplier?: { login?: string };
};

export default function ProductsView() {
    const { products, setProductsData } = useContext(ProductsContext);
    const dispatch = useDispatch();

    const [sp, setSp] = useSearchParams();
    const currentCategory = sp.get("category") ?? "";

    const safeProducts = useMemo<ProductLike[]>(() => {
        return Array.isArray(products) ? products : [];
    }, [products]);

    const categories = useMemo(() => {
        const s = new Set<string>();

        for (const p of safeProducts) {
            const raw = (p as any)?.category;
            const cat =
                typeof raw === "string"
                    ? raw
                    : (raw?.name ?? "");

            const clean = String(cat).trim();
            if (clean) s.add(clean);
        }

        const list = Array.from(s).sort((a, b) => a.localeCompare(b));
        if (currentCategory && !list.includes(currentCategory)) list.unshift(currentCategory);
        return list;
    }, [safeProducts, currentCategory]);

    const setCategoryParam = (v: string) => {
        const next = new URLSearchParams(sp);
        if (v) next.set("category", v);
        else next.delete("category");
        setSp(next, { replace: true });
    };

    const handleAddToCart = (p: ProductLike) => {
        dispatch(
            addToCart({
                id: String(p.id),
                name: String(p.name ?? ""),
                price: Number((p as any)?.price) || 0,
                supplierLogin:
                    (p as any)?.supplierLogin ?? (p as any)?.supplier?.login ?? "",
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
                {safeProducts.map((p) => (
                    <RowProductsTable
                        key={String(p.id)}
                        product={p as any}
                        onAddToCart={() => handleAddToCart(p)}
                        onSavedLocal={(np: any) =>
                            setProductsData((prev: any) => ({
                                ...prev,
                                products: prev.products.map((x: any) => (x.id === np.id ? np : x)),
                            }))
                        }
                        onDeletedLocal={() =>
                            setProductsData((prev: any) => ({
                                ...prev,
                                products: prev.products.filter((x: any) => x.id !== p.id),
                            }))
                        }
                        onBlockedLocal={() =>
                            setProductsData((prev: any) => ({
                                ...prev,
                                products: prev.products.filter((x: any) => x.id !== p.id),
                            }))
                        }
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
