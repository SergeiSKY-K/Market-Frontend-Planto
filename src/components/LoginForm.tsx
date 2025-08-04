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

    const handleLogin = async () => {
        try {
            await login({ username, password }, dispatch);
            navigate("/products");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "300px",
                margin: "100px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                gap: "10px",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Login</h2>

            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
            />
            <button
                onClick={handleLogin}
                style={{
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Login
            </button>
        </div>
    );
};

export default LoginForm;