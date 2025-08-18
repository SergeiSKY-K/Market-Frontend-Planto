import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { thunkFetchModerator } from "../store/ordersSlice";
import { localDT } from "../utils/datetime";

export default function ModeratorOrdersPage() {
    const d = useAppDispatch();
    const { mod } = useAppSelector(s => s.orders);
    const [page, setPage] = useState(0);

    useEffect(() => {
        d(thunkFetchModerator({ page, size: 20, sortBy: "createdAt", direction: "desc" }));
    }, [d, page]);

    return (
        <div className="p-4">
            <h1 className="text-xl mb-2">All Orders</h1>
            <table className="w-full border">
                <thead><tr><th>ID</th><th>Buyer</th><th>Status</th><th>Total</th><th>Created</th></tr></thead>
                <tbody>
                {mod?.content.map(o => (
                    <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.userLogin}</td>
                        <td>{o.status}</td>
                        <td>{o.totalPrice}</td>
                        <td>{localDT(o.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex gap-2 mt-2 items-center">
                <button disabled={!mod || page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>{(page + 1)} / {(mod?.totalPages ?? 1)}</span>
                <button disabled={!mod || page + 1 >= (mod?.totalPages ?? 1)} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
}
