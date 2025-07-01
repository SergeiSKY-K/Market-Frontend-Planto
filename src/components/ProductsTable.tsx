import RowProductsTable from "./RowProductsTable.tsx";
import {useContext} from "react";
import {PageContext, ProductsContext} from "../utils/context.ts";
import {paramsOfSorts} from "../utils/constants.ts";
import {getProductsTable} from "../features/api/productAction.ts";
import {NavLink} from "react-router";

const ProductsTable = () => {

    const {products, pages, setProductsData} = useContext(ProductsContext);
    const {pageNumber, sort, setPage} = useContext(PageContext);

    const handleSelectSort = async (name: string) => {
        const currSort = paramsOfSorts.find((sort) => sort.name === name);
        if (!currSort) {
            return;
        }

        setPage((prevState) => ({...prevState, sort: currSort}));
        setProductsData(await getProductsTable(pageNumber, currSort));
    }

    const getArrayOfPages = (countPages: number)  => {
        const result = [];
        for (let i = 1; i <= countPages; i++){
            result.push(i);
        }

        return result;
    }

    const handleChangePage = async (page: number) => {
        setPage((prevState) => ({...prevState, pageNumber: page}));
        setProductsData(await getProductsTable(page, sort));
    }

    const getNewPage = (direction: number) => {
        let newPage = pageNumber + direction;
        newPage = Math.max(1, newPage);
        newPage = Math.min(pages, newPage);
        return newPage;
    }

   return (

       <div>
           <h1 className={"flex justify-center text-[24px] mt-5 mb-3"}>List of products</h1>
           <div className={"flex justify-end mr-8 space-x-2"}>
               <label className={"block text-base-form"}>
                   Sort by:
                   <select className={"inputField focus: border-base-form mx-3"} onChange={(e) => handleSelectSort(e.target.value)}>
                       {paramsOfSorts.map((sort) => <option value={sort.name} key={sort.name}>{sort.alias}</option>)}
                   </select>
               </label>
           </div>
           <table className={"text-base-form"}>
               <thead className={"border-y-2 border-base-text"}>
               {/*    TODO change to fields from class Product*/}
               <tr>
                   <th className={"pl-2"}>Image</th>
                   <th className={"pl-2"}>Name</th>
                   <th className={"pl-2"}>Category</th>
                   <th className={"pl-2"}>Quantity</th>
                   <th className={"pl-2"}>Price</th>
                   <th className={"pl-2"}>Description</th>
                   <th className={"pl-2"}></th>
               </tr>
               </thead>
               <tbody>
                    {products.map(product => <RowProductsTable key={product.id} product={product}/>)}
               </tbody>
           </table>
           <nav className={"flex justify-center space-x-3"}>
               <NavLink className={"text-base-form"} onClick={() => handleChangePage(1)} key={"first"} to={`http://localhost:5173/products/1`}>{"<<"}</NavLink>
               <NavLink className={"text-base-form"} onClick={() => handleChangePage(getNewPage(-1))} key={"previous"} to={`http://localhost:5173/products/${getNewPage(-1)}`}>{"<"}</NavLink>
                   {getArrayOfPages(pages).map(page => <NavLink
                                                            className={`text-base-form ${page === pageNumber? "font-bold underline" : ""}`}
                                                            onClick={() => handleChangePage(page)} key={page}
                                                            to={`http://localhost:5173/products/${page}`}>
                                                            {page}
                                                        </NavLink>)}
               <NavLink className={"text-base-form"} onClick={() => handleChangePage(getNewPage(1))} key={"next"} to={`http://localhost:5173/products/${getNewPage(1)}`}>{">"}</NavLink>
               <NavLink className={"text-base-form"} onClick={() => handleChangePage(pages)} key={"last"} to={`http://localhost:5173/products/${pages}`}>{">>"}</NavLink>
           </nav>
       </div>
   )
}

export default ProductsTable