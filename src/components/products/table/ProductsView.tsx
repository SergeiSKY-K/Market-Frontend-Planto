import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductsContext } from "../../../utils/context";
import RowProductsTable from "./RowProductsTable";
import { addToCart } from "../../../store/cartSlice";

type ProductLike = {
    id: string | number;
    name: string;
    category?: string;
    price?: number;
    supplierLogin?: string;
    supplier?: { login?: string };
};

export default function ProductsView() {
    const ctx = useContext(ProductsContext);
    if (!ctx) return null;

    const { products, setProductsData } = ctx;
    const dispatch = useDispatch();

    const [sp, setSp] = useSearchParams();
    const currentCategory = sp.get("category") ?? "";

    // Приводим тип products к массиву ProductLike для безопасной работы
    const safeProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.map(p => ({
            id: p.id ?? '',
            name: p.name ?? '',
            category: (p as any).category ?? '',
            price: (p as any).price ?? 0,
            supplierLogin: (p as any).supplierLogin ?? (p as any).supplier?.login ?? '',
            supplier: (p as any).supplier,
        })) as ProductLike[];
    }, [products]);

    const categories = useMemo(() => {
        const s = new Set<string>();

        for (const p of safeProducts) {
            const cat = String(p.category ?? "").trim();
            if (cat) s.add(cat);
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
                <thead className="border-y-2 border-base-text">
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th className="hidden xl:table-cell">Description</th>
                    <th>Actions</th>
                    <th>Cart</th>
                </tr>
                </thead>

                <tbody>
                {safeProducts.map((p) => (
                    <RowProductsTable
                        key={String(p.id)}
                        product={p}
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
                        onAddToCart={() => handleAddToCart(p)}
                        showStatus
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}