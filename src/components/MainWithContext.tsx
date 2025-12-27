import { useState } from "react";
import Main from "./Main";
import { PageContext } from "../utils/context";
import { DEFAULT_SORT } from "../utils/constants";
import type { PageProductsData } from "../utils/types";

export default function MainWithContext() {
    const [pageData, setPage] = useState<PageProductsData>({
        pageNumber: 1,
        sort: DEFAULT_SORT,
        filters: [],
    });

    return (
        <PageContext.Provider
            value={{
                pageNumber: pageData.pageNumber,
                sort: pageData.sort,
                filters: pageData.filters,
                setPage,
            }}
        >
            <Main />
        </PageContext.Provider>
    );
}
