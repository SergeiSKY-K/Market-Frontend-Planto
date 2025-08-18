import { useEffect, useState } from "react";
import { getBlockedProducts, toggleProductStatus } from "../features/api/productAction";

export default function ModeratorBlockedPage() {
    const [items, setItems] = useState<any[]>([]);
    const load = () => getBlockedProducts().then(setItems).catch(console.error);
    useEffect(() => { load(); }, []);

    const unblock = async (id: string) => {
        await toggleProductStatus(id, false);
        setItems(prev => prev.filter(x => x.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-base-form mb-4">Blocked products</h1>
            <table className="w-full table-auto">
                <thead className="border-y-2 border-base-text">
                <tr>
                    <th className="pl-2">Image</th>
                    <th className="pl-2">Name</th>
                    <th className="pl-2">Supplier</th>
                    <th className="pl-2">Reason</th>
                    <th className="pl-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map(p => (
                    <tr key={p.id}>
                        <td className="pl-2 py-2">{p.imageUrl ? <img src={p.imageUrl} className="h-10 w-10 rounded-full object-cover"/> : "-"}</td>
                        <td className="pl-2 py-2">{p.name}</td>
                        <td className="pl-2 py-2">{p.supplierLogin}</td>
                        <td className="pl-2 py-2">{p.description ?? ""}</td>
                        <td className="pl-2 py-2">
                            <button className="button" onClick={() => unblock(p.id)}>Unblock</button>
                        </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td className="pl-2 py-4 opacity-70" colSpan={5}>No blocked products</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
