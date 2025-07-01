import {Route, Routes} from "react-router";
import {DEFAULT_SORT, navItems} from "../utils/constants.ts";
import Home from "./Home.tsx";
import ProductsManager from "./ProductsManager.tsx";
import ErrorPage from "./ErrorPage.tsx";
import {useState} from "react";
import {PageContext} from "../utils/context.ts";
import type {PageProductsData} from "../utils/types";

const Workspace = () => {

    const [pageData, setPage] = useState<PageProductsData>({pageNumber: 1, sort: DEFAULT_SORT});

    return (
        <PageContext.Provider value={{pageNumber: pageData.pageNumber, sort: pageData.sort, setPage: setPage}}>
        <Routes>
            {['/', navItems[0].path, `${navItems[0].path}/`].map(path =>
                <Route key={path} path={path} element={<Home/>}/>)}
            {['/', navItems[1].path, `${navItems[1].path}/:pageNumber`].map(path =>
                    <Route key={path} path={path} element={<ProductsManager/>}/>)}
           <Route path={'*'} element={<ErrorPage/>}/>
        </Routes>
        </PageContext.Provider>
    )
}

export default Workspace