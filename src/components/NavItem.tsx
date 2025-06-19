import type {Item} from "../utils/types";
import {NavLink} from "react-router";

interface Props {
    item: Item
}

const NavItem = (props: Props) => {

    const activeStyle = "bg-[#cd663d] text-[#f5eade] rounded-md";
    const defaultStyle = "text-[#9dbfab]";

    return (
        <li>
            <NavLink to={`${props.item.path}`} className={({isActive}) =>
                    (`block my-3 w-full ${isActive? activeStyle : defaultStyle} font-bold hover:bg-[#cd663d] hover:text-[#f5eade] hover:rounded-md`)}>
                <props.item.icon/> <span>{props.item.title}</span>
            </NavLink>
        </li>
    )
}

export default NavItem