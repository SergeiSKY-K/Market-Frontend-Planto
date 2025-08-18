import { useEffect, useState } from "react";
import {
    getSuppliers,
    grantSupplier,
    revokeSupplier,
    type AppUser,
} from "../features/api/admin"; // ← важное изменение
import { UserPlus, UserMinus, RefreshCw, Mail } from "lucide-react";

export default function SuppliersPage() {
    const [items, setItems] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [grantLogin, setGrantLogin] = useState("");
    const [filter, setFilter] = useState("");

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await getSuppliers();
            setItems(list);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "Failed to load suppliers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!grantLogin.trim()) return;
        setBusy(true);
        setError(null);
        try {
            await grantSupplier(grantLogin.trim());
            setGrantLogin("");
            await load();
            alert("Supplier role granted");
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "Failed to grant role");
        } finally {
            setBusy(false);
        }
    };

    const onRevoke = async (login: string) => {
        if (!confirm(`Remove SUPPLIER role from "${login}"?`)) return;
        setBusy(true);
        setError(null);
        try {
            await revokeSupplier(login);
            setItems(prev => prev.filter(u => u.login !== login));
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "Failed to remove role");
        } finally {
            setBusy(false);
        }
    };

    const filtered = items.filter(
        (u) => !filter || u.login.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[var(--color-base-form)]">Suppliers</h1>
                <button className="action-btn" onClick={load} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </button>
            </div>

            <form onSubmit={onGrant} className="card max-w-xl">
                <div className="text-base font-medium mb-2">Grant supplier by login</div>
                <div className="flex gap-2">
                    <input
                        className="inputField flex-1"
                        placeholder="Enter user login…"
                        value={grantLogin}
                        onChange={(e) => setGrantLogin(e.target.value)}
                    />
                    <button className="action-btn" disabled={busy || !grantLogin.trim()}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Grant
                    </button>
                </div>
                <div className="opacity-70 text-sm mt-2">
                    Moderator/Admin can grant the SUPPLIER role to any existing user by login.
                </div>
            </form>

            {error && <div className="card border-red-400 text-red-600">{error}</div>}

            <div className="card">
                <div className="mb-3">
                    <input
                        className="inputField w-full"
                        placeholder="Filter by login…"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <table className="w-full table-auto">
                    <thead className="border-b">
                    <tr>
                        <th className="pl-2 text-left">Login</th>
                        <th className="pl-2 text-left">Email</th>
                        <th className="pl-2 text-left">Roles</th>
                        <th className="pl-2 text-left w-[180px]">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td className="pl-2 py-4" colSpan={4}>Loading…</td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td className="pl-2 py-4 opacity-70" colSpan={4}>No suppliers</td></tr>
                    ) : (
                        filtered.map((u) => (
                            <tr key={u.login} className="border-t align-top">
                                <td className="pl-2 py-2">{u.login}</td>
                                <td className="pl-2 py-2">
                                    {u.email ? (
                                        <a className="underline inline-flex items-center gap-1" href={`mailto:${u.email}`}>
                                            <Mail className="h-4 w-4" />
                                            {u.email}
                                        </a>
                                    ) : "-"}
                                </td>
                                <td className="pl-2 py-2">{(u.roles || []).join(", ")}</td>
                                <td className="pl-2 py-2">
                                    <button className="action-btn" onClick={() => onRevoke(u.login)} disabled={busy}>
                                        <UserMinus className="h-4 w-4 mr-2" />
                                        Remove supplier
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
