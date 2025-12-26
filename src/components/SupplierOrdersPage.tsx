import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { thunkFetchSupplier } from "../store/ordersSlice";
import { localDT } from "../utils/datetime";
import { RefreshCw, Search, FilterX } from "lucide-react";

type SortKey = "date_desc" | "date_asc" | "total_desc" | "total_asc";

export default function SupplierOrdersPage() {
    const dispatch = useAppDispatch();
    const { supplier, loading } = useAppSelector((s) => s.orders);


    const [q, setQ] = useState("");
    const [status, setStatus] = useState("");
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [min, setMin] = useState<string>("");
    const [max, setMax] = useState<string>("");
    const [sort, setSort] = useState<SortKey>("date_desc");


    const load = () => dispatch(thunkFetchSupplier());
    useEffect(() => { load(); }, []); // при монтировании


    const view = useMemo(() => {
        let rows = supplier.map((o: any) => ({
            ...o,
            _total: Number(o.totalPrice ?? 0),
            _status: o.status ?? "",
        }));


        const needle = q.trim().toLowerCase();
        if (needle) {
            rows = rows.filter(
                (o) =>
                    String(o.id).toLowerCase().includes(needle) ||
                    String(o.userLogin ?? "").toLowerCase().includes(needle)
            );
        }


        if (status) rows = rows.filter((o) => o._status === status);


        if (from) {
            const ts = new Date(from + "T00:00:00").getTime();
            rows = rows.filter((o) => new Date(o.createdAt).getTime() >= ts);
        }
        if (to) {
            const ts = new Date(to + "T23:59:59").getTime();
            rows = rows.filter((o) => new Date(o.createdAt).getTime() <= ts);
        }


        if (min !== "") rows = rows.filter((o) => o._total >= Number(min));
        if (max !== "") rows = rows.filter((o) => o._total <= Number(max));


        rows.sort((a, b) => {
            switch (sort) {
                case "date_asc":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "date_desc":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "total_asc":
                    return a._total - b._total;
                case "total_desc":
                    return b._total - a._total;
                default:
                    return 0;
            }
        });

        return rows;
    }, [supplier, q, status, from, to, min, max, sort]);

    const resetAll = () => {
        setQ("");
        setStatus("");
        setFrom("");
        setTo("");
        setMin("");
        setMax("");
        setSort("date_desc");
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[var(--color-base-form)]">Supplier orders</h1>
                <button className="action-btn" onClick={load} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </button>
            </div>


            <div className="card">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <div className="text-sm mb-1">Search</div>
                        <div className="flex gap-2">
                            <input
                                className="inputField w-full"
                                placeholder="Order id / buyer…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            <button className="action-btn" onClick={() => setQ(q)}>
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm mb-1">Status</div>
                        <select
                            className="inputField w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="CREATED">CREATED</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-sm mb-1">Date from</div>
                        <input
                            type="date"
                            className="inputField w-full"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="text-sm mb-1">Date to</div>
                        <input
                            type="date"
                            className="inputField w-full"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="text-sm mb-1">Min total</div>
                        <input
                            type="number"
                            className="inputField w-full"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="text-sm mb-1">Max total</div>
                        <input
                            type="number"
                            className="inputField w-full"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="text-sm mb-1">Sort by</div>
                        <select
                            className="inputField w-full"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                        >
                            <option value="date_desc">Date (new first)</option>
                            <option value="date_asc">Date (old first)</option>
                            <option value="total_desc">Total (high → low)</option>
                            <option value="total_asc">Total (low → high)</option>
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button className="action-btn" onClick={() => { /* apply is instant via state */ }}>
                            <Search className="h-4 w-4 mr-1" /> Apply
                        </button>
                        <button className="action-btn" type="button" onClick={resetAll}>
                            <FilterX className="h-4 w-4 mr-1" /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="card overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="border-b">
                    <tr>
                        <th className="pl-2 text-left">ID</th>
                        <th className="pl-2 text-left">Buyer</th>
                        <th className="pl-2 text-left">Total</th>
                        <th className="pl-2 text-left">Status</th>
                        <th className="pl-2 text-left">Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td className="pl-2 py-4" colSpan={5}>Loading…</td></tr>
                    ) : view.length === 0 ? (
                        <tr><td className="pl-2 py-4 opacity-70" colSpan={5}>No orders</td></tr>
                    ) : (
                        view.map((o: any) => (
                            <tr key={o.id} className="border-t">
                                <td className="pl-2 py-2">{o.id}</td>
                                <td className="pl-2 py-2">{o.userLogin ?? "-"}</td>
                                <td className="pl-2 py-2">{Number(o._total).toFixed(2)}</td>
                                <td className="pl-2 py-2">
                                    {o._status ? (
                                        <span className="px-2 py-1 rounded bg-[var(--color-light-green)]/25 text-[var(--color-base-form)]">
                        {o._status}
                      </span>
                                    ) : "-"}
                                </td>
                                <td className="pl-2 py-2">{localDT(o.createdAt)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
