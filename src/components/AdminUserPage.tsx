import { useEffect, useState } from "react";
import { getAllUsers, addRole, removeRole, deleteUser } from "../features/api/admin";

const ROLES = ["USER","SUPPLIER","MODERATOR","ADMINISTRATOR"];

export default function AdminUsersPage(){
    const [items,setItems]=useState<any[]>([]);
    const [loading,setLoading]=useState(true);
    const [rolePick,setRolePick]=useState<Record<string,string>>({});

    const reload = async () => {
        setLoading(true);
        try { setItems(await getAllUsers()); }
        finally { setLoading(false); }
    };

    useEffect(()=>{ void reload(); },[]);

    const grant  = async (login:string) => { await addRole(login, rolePick[login]||"SUPPLIER"); await reload(); };
    const revoke = async (login:string) => { await removeRole(login, rolePick[login]||"SUPPLIER"); await reload(); };
    const remove = async (login:string) => {
        if (!confirm(`Delete user "${login}"? This cannot be undone.`)) return;
        await deleteUser(login);
        await reload();
    };

    if (loading) return <div>Loading…</div>;

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">Users & roles</h2>
            <table className="w-full border rounded">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Login</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Roles</th>
                    <th className="p-2">Manage</th>
                    <th className="p-2">Danger</th>
                </tr>
                </thead>
                <tbody>
                {items.map(u=>(
                    <tr key={u.login} className="border-t">
                        <td className="p-2">{u.login}</td>
                        <td className="p-2">{[u.firstName,u.lastName].filter(Boolean).join(" ")}</td>
                        <td className="p-2">{(u.roles||[]).join(", ")}</td>
                        <td className="p-2 flex gap-2">
                            <select
                                className="border px-2 py-1"
                                value={rolePick[u.login]||"SUPPLIER"}
                                onChange={e=>setRolePick(s=>({...s,[u.login]:e.target.value}))}
                            >
                                {ROLES.map(r=> <option key={r} value={r}>{r}</option>)}
                            </select>
                            <button className="px-3 py-1 rounded bg-emerald-700 text-white" onClick={()=>grant(u.login)}>Grant</button>
                            <button className="px-3 py-1 rounded bg-amber-700 text-white"  onClick={()=>revoke(u.login)}>Revoke</button>
                        </td>
                        <td className="p-2">
                            <button className="px-3 py-1 rounded bg-rose-700 text-white" onClick={()=>remove(u.login)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
