import { useState } from "react";
import { register } from "../features/api/authApi.ts";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName]   = useState("");
    const [password, setPassword]   = useState("");
    const [confirm, setConfirm]     = useState("");
    const [loading, setLoading]     = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!login || !password) { alert("Login and Password are required"); return; }
        if (password !== confirm) { alert("Passwords do not match"); return; }
        if (password.length < 6)   { alert("Password must be at least 6 characters"); return; }

        setLoading(true);
        try {
            await register({ login, password, firstName, lastName });
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Registration error";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Login *</label>
                    <input className="w-full border rounded px-3 py-2"
                           value={login} onChange={e=>setLogin(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">First name</label>
                    <input className="w-full border rounded px-3 py-2"
                           value={firstName} onChange={e=>setFirstName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Last name</label>
                    <input className="w-full border rounded px-3 py-2"
                           value={lastName} onChange={e=>setLastName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password *</label>
                    <input type="password" className="w-full border rounded px-3 py-2"
                           value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Confirm password *</label>
                    <input type="password" className="w-full border rounded px-3 py-2"
                           value={confirm} onChange={e=>setConfirm(e.target.value)} />
                </div>
                <button type="submit" disabled={loading}
                        className="w-full mt-2 px-4 py-2 rounded bg-emerald-700 text-white disabled:opacity-60">
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <div className="mt-4 text-sm">
                Already have an account?{" "} <Link to="/login" className="text-emerald-700 underline">Login</Link>
            </div>
        </div>
    );
}
