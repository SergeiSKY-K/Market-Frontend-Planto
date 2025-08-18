import { useEffect, useState } from "react";
import { getMyProducts } from "../features/api/productAction";
import RowProductsTable from "./products/table/RowProductsTable";

export default function SupplierProductsPage() {
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => { getMyProducts().then(setItems).catch(console.error); }, []);

    return (
        <div className="p-6">
            <h1 className="text-base-form mb-4">My products (all statuses)</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="border-y-2 border-base-text">
                    <tr>
                        <th className="pl-2">Image</th>
                        <th className="pl-2">Name</th>
                        <th className="pl-2">Category</th>
                        <th className="pl-2">Quantity</th>
                        <th className="pl-2">Price</th>
                        <th className="pl-2">Status</th>
                        <th className="pl-2">Actions</th>
                        <th className="pl-2">Cart</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((p) => (
                        <RowProductsTable
                            key={p.id}
                            product={p}
                            onSavedLocal={(np)=>setItems(prev=>prev.map(x=>x.id===np.id?np:x))}
                            onDeletedLocal={()=>setItems(prev=>prev.filter(x=>x.id!==p.id))}
                            onAddToCart={()=>{}}
                            showStatus
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
