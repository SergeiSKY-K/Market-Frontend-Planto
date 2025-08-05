import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { login } from "../features/api/authApi";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await login({ username, password }, dispatch);
            navigate("/products");
        } catch (err: any) {
            setError("Login failed. Please check your credentials.");
            console.error("Login failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "320px",
                margin: "100px auto",
                padding: "24px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                gap: "12px",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Login</h2>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #aaa" }}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #aaa" }}
            />

            {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                    padding: "12px",
                    backgroundColor: loading ? "#aaa" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                }}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
};

export default LoginForm;
