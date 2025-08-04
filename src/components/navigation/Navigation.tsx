import { navItems } from "../../utils/constants.ts";
import NavItem from "./NavItem.tsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/api/logout.ts";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = useSelector((state: RootState) => state.token.accessToken); // или state.user?.login если есть user

    const handleLogout = async () => {
        try {
            if (!login) return;

            await logout(dispatch, login); // login — строка, например, "admin"
            navigate("/login");
        } catch (e) {
            console.error("Logout error", e);
        }
    };

    return (
        <nav className={"col-span-1 bg-base-form h-full py-10 px-3"}>
            <ul>
                {navItems.map(item => <NavItem key={item.path} item={item} />)}
                <li className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;