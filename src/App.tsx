import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setAccessToken } from "./store/tokenSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import MainWithContext from "./components/MainWithContext";

import Home from "./components/Home";
import ProductsManager from "./components/products/ProductsManager";
import ProfilePage from "./components/ProfilePage";
import SuppliersPage from "./components/SuppliersPage";
import AdminUsersPage from "./components/AdminUserPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ErrorPage from "./components/ErrorPage";

import MyOrdersPage from "./components/MyOrdersPage";
import SupplierOrdersPage from "./components/SupplierOrdersPage";
import ModeratorOrdersPage from "./components/ModeratorOrdersPage";
import CartPage from "./components/CartPage";
import SupplierProductsPage from "./components/SupplierProductsPage";
import ModeratorBlockedPage from "./components/ModeratorBlockedPage";

const API = import.meta.env.VITE_BASE_API_URL;

export default function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [bootstrapped, setBootstrapped] = useState(false);

    useEffect(() => {
        const isAuthPage =
            location.pathname === "/login" ||
            location.pathname === "/register";

        if (isAuthPage) {
            setBootstrapped(true);
            return;
        }

        const bootstrapAuth = async () => {
            try {
                const resp = await axios.post(
                    `${API}/auth/refresh`,
                    null,
                    { withCredentials: true }
                );

                const accessToken = resp.data?.accessToken;
                if (accessToken) {
                    dispatch(setAccessToken(accessToken));
                }
            } catch {
                // не залогинен — ок
            } finally {
                setBootstrapped(true);
            }
        };

        bootstrapAuth();
    }, [dispatch, location.pathname]);

    if (!bootstrapped) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>

            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />


            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainWithContext />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="products/:pageNumber" element={<ProductsManager />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="cart" element={<CartPage />} />

                <Route path="orders" element={<MyOrdersPage />} />

                <Route
                    path="supplier/orders"
                    element={
                        <ProtectedRoute allowedRoles={["SUPPLIER", "ADMINISTRATOR"]}>
                            <SupplierOrdersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="moderator/orders"
                    element={
                        <ProtectedRoute allowedRoles={["MODERATOR"]}>
                            <ModeratorOrdersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="suppliers"
                    element={
                        <ProtectedRoute allowedRoles={["MODERATOR", "ADMINISTRATOR"]}>
                            <SuppliersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/users"
                    element={
                        <ProtectedRoute allowedRoles={["ADMINISTRATOR"]}>
                            <AdminUsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="supplier/my-products"
                    element={
                        <ProtectedRoute allowedRoles={["SUPPLIER", "ADMINISTRATOR"]}>
                            <SupplierProductsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="moderator/blacklist"
                    element={
                        <ProtectedRoute allowedRoles={["MODERATOR", "ADMINISTRATOR"]}>
                            <ModeratorBlockedPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<ErrorPage msg="Page not found" />} />
            </Route>

            <Route path="*" element={<ErrorPage msg="Page not found" />} />
        </Routes>
    );
}
