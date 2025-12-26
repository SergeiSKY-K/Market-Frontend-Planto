import type { Item } from "../../utils/types";
import { NavLink, useNavigate } from "react-router-dom"; // <-- было "react-router"
import { useContext } from "react";
import { PageContext } from "../../utils/context";


export default function NavItem({ item }: { item: Item }) {
    const { pageNumber } = useContext(PageContext);
    const navigate = useNavigate();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (item.path === "products") {
            e.preventDefault();
            navigate(`/products/${pageNumber || 1}`);
        }
    };

    return (
        <li>
            <NavLink
                to={item.path || "/"}
                end={item.path === ""}
                className={({ isActive }) =>
                    `flex gap-2 items-center my-3 w-full h-10 ${
                        isActive ? "bg-alt-text text-base-bg rounded-md" : "text-light-green"
                    } font-bold hover:bg-alt-text hover:text-base-bg hover:rounded-md`
                }
                onClick={handleNavClick}
            >
                <item.icon />
                <span>{item.title}</span>
            </NavLink>
        </li>
    );
}
