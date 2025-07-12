import RowProductsTable from "./RowProductsTable.tsx";
import {useContext} from "react";
import {PageContext, ProductsContext} from "../utils/context.ts";
import {paramsOfSorts} from "../utils/constants.ts";
import {getProductsTable} from "../features/api/productAction.ts";
import {NavLink} from "react-router";
import {SearchBar} from "./SearchBar.tsx";
import {Filters} from "./Filters.tsx";

const ProductsTable = () => {

    const {products, pages, setProductsData} = useContext(ProductsContext);
    const {pageNumber, sort, filters, setPage} = useContext(PageContext);

    const handleSelectSort = async (name: string) => {
        const currSort = paramsOfSorts.find((sort) => sort.name === name);
        if (!currSort) {
            return;
        }

        setPage((prevState) => ({...prevState, sort: currSort}));
        setProductsData(await getProductsTable(pageNumber, currSort, filters));
    }

    const getArrayOfPages = (countPages: number)  => {
        return Array.from({length: countPages}, (_, i) => i + 1);
    }

    const handleChangePage = async (page: number) => {
        setPage((prevState) => ({...prevState, pageNumber: page}));
        setProductsData(await getProductsTable(page, sort, filters));
    }

    const getNewPage = (direction: number) => {
        let newPage = pageNumber + direction;
        newPage = Math.max(1, newPage);
        newPage = Math.min(pages, newPage);
        return newPage;
    }

   return (

       <div className={"flex-col items-center"}>
           <h1 className={"flex justify-center text-[24px] mt-5 mb-3"}>List of products</h1>
           <div className={"flex justify-between items-center mr-8 space-x-3"}>
               <SearchBar/>
               <div className={"flex justify-end w-2/5"}>
                   <label className={"text-base-form flex items-center"} htmlFor={"sorting"}>
                       Sort by:
                       <select
                           id={"sorting"}
                           className={"inputField focus: border-base-form ml-2"}
                           onChange={(e) => handleSelectSort(e.target.value)}>
                           {paramsOfSorts.map((sort) => <option value={sort.name}
                                                                key={sort.name}>{sort.alias}</option>)}
                       </select>
                   </label>
               </div>
           </div>
           <Filters/>
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
                       <NavLink className={"text-base-form"} onClick={() => handleChangePage(1)} key={"first"} to={`/products/1`}>{"<<"}</NavLink>
                       <NavLink className={"text-base-form"} onClick={() => handleChangePage(getNewPage(-1))} key={"previous"} to={`/products/${getNewPage(-1)}`}>{"<"}</NavLink>
                       {getArrayOfPages(pages).map(page => <NavLink
                           className={`text-base-form ${page === pageNumber ? "font-bold underline" : ""}`}
                           onClick={() => handleChangePage(page)} key={page}
                           to={`/products/${page}`}>
                           {page}
                       </NavLink>)}
                       <NavLink className={"text-base-form"} onClick={() => handleChangePage(getNewPage(1))} key={"next"} to={`/products/${getNewPage(1)}`}>{">"}</NavLink>
                       <NavLink className={"text-base-form"} onClick={() => handleChangePage(pages)} key={"last"} to={`/products/${pages}`}>{">>"}</NavLink>
                   </nav>
       </div>
   )
}

export default ProductsTable