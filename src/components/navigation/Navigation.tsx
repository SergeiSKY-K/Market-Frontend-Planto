import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { clearAccessToken } from "../../store/tokenSlice";
import { getRolesFromJwt } from "../../utils/jwt";
import { selectCartCount } from "../../store/cartSlice";

import {
    Home, Boxes, User, ShoppingCart, PackageSearch, Users, Shield, LogOut,
} from "lucide-react";

export default function Navigation() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((s: RootState) => s.token.accessToken);
    const roles = token ? getRolesFromJwt(token) : [];
    const cartCount = useSelector(selectCartCount);

    const onLogout = () => {
        dispatch(clearAccessToken());
        navigate("/login");
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        "side-link " + (isActive ? "side-link--active" : "");

    const isSupplier = roles.includes("SUPPLIER") || roles.includes("ADMINISTRATOR");
    const isModerator = roles.includes("MODERATOR");
    const isAdminOrMod = roles.includes("ADMINISTRATOR") || roles.includes("MODERATOR");
    const isAdmin = roles.includes("ADMINISTRATOR");

    return (
        <aside className="sidebar">
            <nav className="flex flex-col gap-1">
                <NavLink to="/" end className={linkClass}>
                    <Home className="side-icon" />
                    <span>Main</span>
                </NavLink>

                <NavLink to="/products" className={linkClass}>
                    <Boxes className="side-icon" />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/profile" className={linkClass}>
                    <User className="side-icon" />
                    <span>Profile</span>
                </NavLink>

                <NavLink to="/cart" className={linkClass}>
                    <ShoppingCart className="side-icon" />
                    <span>Cart</span>
                    {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </NavLink>

                <div className="nav-label">Orders</div>

                <NavLink to="/orders" className={linkClass}>
                    <PackageSearch className="side-icon" />
                    <span>My orders</span>
                </NavLink>

                {isSupplier && (
                    <NavLink to="/supplier/orders" className={linkClass}>
                        <PackageSearch className="side-icon" />
                        <span>Supplier orders</span>
                    </NavLink>
                )}

                {isModerator && (
                    <NavLink to="/moderator/orders" className={linkClass}>
                        <Shield className="side-icon" />
                        <span>Moderator orders</span>
                    </NavLink>
                )}

                {/* НОВОЕ — страница «Мои товары» */}
                {isSupplier && (
                    <NavLink to="/supplier/my-products" className={linkClass}>
                        <Boxes className="side-icon" />
                        <span>My products</span>
                    </NavLink>
                )}

                {/* НОВОЕ — страница «Black list» */}
                {isAdminOrMod && (
                    <NavLink to="/moderator/blacklist" className={linkClass}>
                        <Shield className="side-icon" />
                        <span>Black list</span>
                    </NavLink>
                )}

                {isAdminOrMod && (
                    <NavLink to="/suppliers" className={linkClass}>
                        <Users className="side-icon" />
                        <span>Suppliers</span>
                    </NavLink>
                )}

                {isAdmin && (
                    <NavLink to="/admin/users" className={linkClass}>
                        <Users className="side-icon" />
                        <span>Users</span>
                    </NavLink>
                )}
            </nav>

            <button className="logout" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </aside>
    );
}
