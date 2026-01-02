import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "./features/api/axiosInstance";
import { setAccessToken, setAuthReady } from "./store/tokenSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import MainWithContext from "./components/MainWithContext";

import Home from "./components/Home";
import ProductsManager from "./components/products/ProductsManager";
import ProfilePage from "./components/ProfilePage";
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
import SuppliersPage from "./components/SuppliersPage";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            try {
                const resp = await axiosInstance.post("/auth/refresh");
                const authHeader = resp.headers["authorization"];
                const token = authHeader?.replace("Bearer ", "");

                if (token) {
                    dispatch(setAccessToken(token));
                }
            } catch {
                // не залогинен — нормально
            } finally {
                dispatch(setAuthReady());
            }
        };

        init();
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainWithContext />}>
                    <Route index element={<Home />} />

                    <Route path="products" element={<ProductsManager />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="orders" element={<MyOrdersPage />} />

                    <Route element={<ProtectedRoute allowedRoles={["SUPPLIER", "ADMINISTRATOR"]} />}>
                        <Route path="supplier/orders" element={<SupplierOrdersPage />} />
                        <Route path="supplier/my-products" element={<SupplierProductsPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["MODERATOR", "ADMINISTRATOR"]} />}>
                        <Route path="moderator/orders" element={<ModeratorOrdersPage />} />
                        <Route path="moderator/blacklist" element={<ModeratorBlockedPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["MODERATOR", "ADMINISTRATOR"]} />}>
                        <Route path="suppliers" element={<SuppliersPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMINISTRATOR"]} />}>
                        <Route path="admin/users" element={<AdminUsersPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<ErrorPage msg="Page not found" />} />
        </Routes>
    );
}
