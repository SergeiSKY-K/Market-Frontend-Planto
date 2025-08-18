import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { thunkFetchMy, thunkPayOrder } from "../store/ordersSlice";
import { localDT } from "../utils/datetime";

export default function MyOrdersPage() {
    const d = useAppDispatch();
    const { my, loading } = useAppSelector(s => s.orders);

    useEffect(() => { d(thunkFetchMy()); }, [d]);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl mb-2">My Orders</h1>
            <table className="w-full border">
                <thead>
                <tr><th>ID</th><th>Status</th><th>Total</th><th>Created</th><th>Paid</th><th/></tr>
                </thead>
                <tbody>
                {my.map(o => (
                    <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.status}</td>
                        <td>{o.totalPrice}</td>
                        <td>{localDT(o.createdAt)}</td>
                        <td>{localDT(o.paidAt)}</td>
                        <td>
                            {o.status === "CREATED" && (
                                <button className="px-3 py-1 border rounded" onClick={() => d(thunkPayOrder(o.id))}>
                                    Pay
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
