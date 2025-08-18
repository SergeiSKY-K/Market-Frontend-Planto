import { Routes, Route } from "react-router-dom";
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

// НОВОЕ
import SupplierProductsPage from "./components/SupplierProductsPage";
import ModeratorBlockedPage from "./components/ModeratorBlockedPage";

export default function App() {
    return (
        <Routes>
            {/* public */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* layout + nested */}
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

                {/* cart */}
                <Route path="cart" element={<CartPage />} />

                {/* orders */}
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

                {/* НОВОЕ */}
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

                {/* nested 404 */}
                <Route path="*" element={<ErrorPage msg="Page not found" />} />
            </Route>

            {/* fallback 404 */}
            <Route path="*" element={<ErrorPage msg="Page not found" />} />
        </Routes>
    );
}
