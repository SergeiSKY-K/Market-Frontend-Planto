import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductsContext } from "../../../utils/context";
import RowProductsTable from "./RowProductsTable";
import { addToCart } from "../../../store/cartSlice";

export default function ProductsView() {
    const { products, setProductsData } = useContext(ProductsContext);
    const dispatch = useDispatch();

    const [sp, setSp] = useSearchParams();
    const currentCategory = sp.get("category") ?? "";

    const categories = useMemo(() => {
        const s = new Set<string>();
        for (const p of products) {
            const cat =
                typeof p.category === "string" ? p.category : (p.category?.name ?? "");
            if (cat) s.add(cat);
        }
        const list = Array.from(s).sort((a, b) => a.localeCompare(b));
        // если в URL есть категория, которой нет в текущем списке — всё равно покажем её в селекте
        if (currentCategory && !list.includes(currentCategory)) list.unshift(currentCategory);
        return list;
    }, [products, currentCategory]);

    const setCategoryParam = (v: string) => {
        const next = new URLSearchParams(sp);
        if (v) next.set("category", v);
        else next.delete("category");
        setSp(next, { replace: true });
    };

    const handleAddToCart = (p: any) => {
        dispatch(
            addToCart({
                id: String(p.id),
                name: p.name,
                price: Number(p.price) || 0,
                supplierLogin: p.supplierLogin ?? p.supplier?.login ?? "",
                qty: 1,
            })
        );
        console.log("add-to-cart", p.id);
    };

    return (
        <div className="overflow-x-auto">
            {/* панель фильтров (только категория — по задаче) */}
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
                <thead className="border-y-2 border-base-text">
                <tr>
                    <th className="pl-2">Image</th>
                    <th className="pl-2">Name</th>
                    <th className="pl-2">Category</th>
                    <th className="pl-2">Quantity</th>
                    <th className="pl-2">Price</th>
                    <th className="pl-2 hidden xl:table-cell">Description</th>
                    <th className="pl-2 w-[150px] text-center">Actions</th>
                    <th className="pl-2 w-[64px] text-center">Cart</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p: any) => (
                    <RowProductsTable
                        key={p.id}
                        product={p}
                        onSavedLocal={(np) =>
                            setProductsData((prev: any) => ({
                                ...prev,
                                products: prev.products.map((x: any) =>
                                    x.id === np.id ? np : x
                                ),
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
