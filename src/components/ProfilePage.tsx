// src/components/ProfilePage.tsx
import { useEffect, useState } from "react";
import { changePassword, deleteUserSelf, getUserByLogin, updateUserSelf } from "../features/api/user";
import store from "../store/store";
import { getSubFromJwt } from "../utils/jwt";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate = useNavigate();
    const token = store.getState().token.accessToken as string | undefined;
    const login = getSubFromJwt(token || "") || "";

    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        (async () => {
            if (!login) return;
            setLoading(true);
            try {
                const me = await getUserByLogin(login);
                setFirstName(me.firstName ?? "");
                setLastName(me.lastName ?? "");
            } finally {
                setLoading(false);
            }
        })();
    }, [login]);

    const saveProfile = async () => {
        await updateUserSelf(login, { firstName, lastName });
        alert("Saved");
    };

    // внутри submitPassword
    const submitPassword = async () => {
        if (!oldPassword || !newPassword) {
            alert("Fill both passwords");
            return;
        }
        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters");
            return;
        }

        try {
            await changePassword({ oldPassword, newPassword });
            setOldPassword("");
            setNewPassword("");
            alert("Password changed");
        } catch (err: any) {
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || err?.response?.data || err?.message || "";
            if (status === 400) {
                alert(msg || "Invalid password data");
            } else if (status === 403) {
                alert(msg || "Forbidden. Please re-login.");
            } else if (status === 401) {
                alert(msg || "Unauthorized. Please re-login.");
            } else {
                alert("Unexpected error: " + msg);
            }
        }
    };



    const removeAccount = async () => {
        if (!confirm("Delete your account?")) return;
        await deleteUserSelf(login);
        navigate("/login");
    };

    if (!login) return <div>Not authorized</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-semibold mb-6">My profile</h2>

            <div className="rounded-2xl shadow p-5 bg-white/70 mb-6 space-y-3">
                <div>
                    <label className="block text-sm mb-1">Login</label>
                    <input value={login} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div>
                    <label className="block text-sm mb-1">First name</label>
                    <input value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Last name</label>
                    <input value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <button onClick={saveProfile} className="mt-2 px-4 py-2 rounded bg-green-700 text-white">Save</button>
            </div>

            <div className="rounded-2xl shadow p-5 bg-white/70 mb-6 space-y-3">
                <h3 className="font-medium">Change password</h3>
                <input type="password" placeholder="Old password" value={oldPassword}
                       onChange={e => setOldPassword(e.target.value)} className="w-full border rounded px-3 py-2"/>
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    minLength={6}
                />

                <button
                    onClick={submitPassword}
                    className="mt-2 px-4 py-2 rounded bg-emerald-700 text-white"
                    disabled={!oldPassword || newPassword.length < 6}
                >
                    Change
                </button>
            </div>

            <button onClick={removeAccount} className="text-red-600 hover:underline">
                Delete account
            </button>
        </div>
    );
}
