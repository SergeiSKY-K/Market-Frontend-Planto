import AddProduct from "./AddProduct.tsx";
import Table from "./Table.tsx";

const Workspace = () => {
    return (
        <div className={"col-span-6"}>
            <AddProduct/>
            <Table />
        </div>
    )
}

export default Workspace