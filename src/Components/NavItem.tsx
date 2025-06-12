import type {Item} from "../utils/types";

interface Props {
    item: Item
}

const NavItem = (props: Props) => {
    return (
        <li className={"text-[#9dbfab] font-bold"}>{props.item.title}</li>
    )
}

export default NavItem