import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getRolesFromJwt } from "../utils/jwt";
import { Boxes, ShoppingCart, PackageSearch, Users, Shield } from "lucide-react";

export default function Home() {
    const token = useSelector((s: RootState) => s.token.accessToken);
    const roles = token ? getRolesFromJwt(token) : [];

    return (
        <div className="p-6 space-y-6">
            {/* единственный hero с фото на фоне */}
            <div className="hero hero--bg hero--tall">
                <h1 className="text-3xl font-semibold leading-tight">Dashboards</h1>
                <p className="opacity-90">Quick actions & helpful links.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <NavLink to="/products" className="card hover:opacity-90 transition">
                    <div className="flex items-center gap-3">
                        <Boxes />
                        <div>
                            <div className="font-medium">Products</div>
                            <div className="opacity-70 text-sm">Browse & add products</div>
                        </div>
                    </div>
                </NavLink>

                <NavLink to="/cart" className="card hover:opacity-90 transition">
                    <div className="flex items-center gap-3">
                        <ShoppingCart />
                        <div>
                            <div className="font-medium">Cart</div>
                            <div className="opacity-70 text-sm">Checkout</div>
                        </div>
                    </div>
                </NavLink>

                <NavLink to="/orders" className="card hover:opacity-90 transition">
                    <div className="flex items-center gap-3">
                        <PackageSearch />
                        <div>
                            <div className="font-medium">My orders</div>
                            <div className="opacity-70 text-sm">Order history & payments</div>
                        </div>
                    </div>
                </NavLink>

                {(roles.includes("SUPPLIER") || roles.includes("ADMINISTRATOR")) && (
                    <NavLink to="/supplier/orders" className="card hover:opacity-90 transition">
                        <div className="flex items-center gap-3">
                            <PackageSearch />
                            <div>
                                <div className="font-medium">Supplier orders</div>
                                <div className="opacity-70 text-sm">Orders containing my products</div>
                            </div>
                        </div>
                    </NavLink>
                )}

                {roles.includes("MODERATOR") && (
                    <NavLink to="/moderator/orders" className="card hover:opacity-90 transition">
                        <div className="flex items-center gap-3">
                            <Shield />
                            <div>
                                <div className="font-medium">Moderator orders</div>
                                <div className="opacity-70 text-sm">All orders</div>
                            </div>
                        </div>
                    </NavLink>
                )}

                {(roles.includes("MODERATOR") || roles.includes("ADMINISTRATOR")) && (
                    <NavLink to="/suppliers" className="card hover:opacity-90 transition">
                        <div className="flex items-center gap-3">
                            <Users />
                            <div>
                                <div className="font-medium">Suppliers</div>
                                <div className="opacity-70 text-sm">List & manage suppliers</div>
                            </div>
                        </div>
                    </NavLink>
                )}
            </div>
        </div>
    );
}
