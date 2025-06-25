import type {Item} from "../utils/types";
import {NavLink} from "react-router";

interface Props {
    item: Item
}

const NavItem = (props: Props) => {

    const activeStyle = "bg-alt-text text-base-bg rounded-md";
    const defaultStyle = "text-light-green";

    return (
        <li>
            <NavLink to={`${props.item.path}`} className={({isActive}) =>
                    (`flex items-center my-3 w-full h-10 ${isActive? activeStyle : defaultStyle} font-bold hover:bg-alt-text hover:text-base-bg hover:rounded-md`)}>
                <props.item.icon/> <span>{props.item.title}</span>
            </NavLink>
        </li>
    )
}

export default NavItem