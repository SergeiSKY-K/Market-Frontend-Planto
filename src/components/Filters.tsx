import {useContext, useState} from "react";
import {PageContext} from "../utils/context.ts";
import {DATA_FOR_FILTERS, FILTER_CATEGORY, FILTER_PRICE} from "../utils/constants.ts";

export const Filters = () => {

    const {filters, setPage} = useContext(PageContext);

    const [filterCategory, setFilterCategory] = useState(FILTER_CATEGORY);
    const [filterPrice, setFilterPrice] = useState(FILTER_PRICE);

    const handlerCheckCategory = (value: string, checked: boolean) => {

        const arr = filterCategory.valueList.slice(0, filterCategory.valueList.length);

        if (checked) {
            arr.push(value);
        } else {
            const index = arr.indexOf(value, 0);
            if (index >= 0) {
                arr.splice(index, 1);
            }
        }
        setFilterCategory((prevState) => prevState.getCopy({valueList: arr}));
    }

    const handlerChangePrice = (field: HTMLInputElement, value: string) => {
        if (field.id === "priceFrom") {
            setFilterPrice((prevState) => prevState.getCopy({valueFrom: Number.parseInt(value)}));
        } else if (field.id === "priceTo") {
            setFilterPrice((prevState) => prevState.getCopy({valueTo: Number.parseInt(value)}));
        }
    }

    const handlerAcceptFilters = () => {
        const currFilters = [filterCategory, filterPrice];
        const newFilters = filters.slice();

        currFilters.forEach((filter) => {

            const index = newFilters.findIndex((f) => f.field.toLowerCase() == filter.field);

            let action = "";
            if (index >= 0 && filter.isChanged) {
                if (filter.field == "category") {
                    action = filter.valueList.length > 0 ? "add" : "remove";
                } else if (filter.field == "price") {
                    action = "add";
                }
                if (action == "add") {
                    newFilters[index] = filter;
                } else {
                    newFilters.splice(index, 1);
                }
            } else if (filter.isChanged) {
                newFilters.push(filter);
            } else if (index >= 0) {
                newFilters.splice(index, 1);
            }
        })
        setPage((prevState) => ({...prevState, filters: newFilters}))
    }

    const handlerResetFilters = () => {

        const fields = ["category", "price"];

        for (let i = 0; i < fields.length; i++) {
            const index = filters.findIndex((filter) => filter.field == "category");

            if (index >= 0) {
                filters.splice(index, 1);
            }
        }

        setFilterCategory(FILTER_CATEGORY.getCopy({...FILTER_CATEGORY}));
        setFilterPrice(FILTER_PRICE.getCopy({...FILTER_PRICE}));
        setPage((prevState) => ({...prevState, filters: filters.slice()}))
    }

    return (
        <>
            <div className={"flex flex-row items-center my-2 space-x-3 border-base-form border-1 rounded-md mr-8"}>
                <div className={"flex flex-row items-center space-x-1"}>
                    <label className={"text-base-text mx-2"}>Filter by category:</label>
                    {/*<select className={"inputFieldTable px-2.5 pb-2.5 mt-2 pt-4 h-8"} multiple={true} size={categories.length}>*/}
                    {/*    <option value={undefined} key={"all"}>not selected</option>*/}
                    {/*    {categories.map(category =>*/}
                    {/*        <option value={category} key={category}>*/}
                    {/*            {category}*/}
                    {/*        </option>)}*/}
                    {/*</select>*/}
                    {DATA_FOR_FILTERS.categories.map(category => <>
                        <input
                            type={"checkbox"}
                            className={"inputFieldTable"}
                            value={category!}
                            key={category}
                            checked={filterCategory.valueList!.includes(category, 0)}
                            onChange={(e) => handlerCheckCategory(e.target.value, e.target.checked)}
                        />
                        <label className={"text-base-text mr-3"}>
                            {category}
                        </label>
                    </>)}
                </div>
                <div className={"flex flex-row items-center space-x-1 my-2"}>
                    <p className={"inline-block text-base-text mx-2"}>Filter by price:</p>
                    <div className={"relative h-10"}>
                        <label className={"text-base-text text-xs absolute bg-base-bg z-10 ml-2 px-1"}>
                            from:
                        </label>
                        <input
                            type={"number"}
                            className={"inputFieldTable w-28 px-2.5 pb-2.5 mt-2 pt-4 h-8"}
                            id={"priceFrom"}
                            placeholder={" "}
                            min={0}
                            max={DATA_FOR_FILTERS.maxPrice}
                            value={filterPrice.valueFrom ? filterPrice.valueFrom : 0}
                            onChange={(e) => handlerChangePrice(e.target, e.target.value)}/>
                    </div>
                    <p>-</p>
                    <div>
                        <label className={"text-base-text text-xs absolute bg-base-bg z-10 ml-2 px-1"}>
                            to:
                        </label>
                        <input
                            type={"number"}
                            className={"inputFieldTable w-28 px-2.5 pb-2.5 mt-2 pt-4 h-8"}
                            id={"priceTo"}
                            placeholder={" "}
                            max={DATA_FOR_FILTERS.maxPrice}
                            value={filterPrice.valueTo ? filterPrice.valueTo : DATA_FOR_FILTERS.maxPrice}
                            onChange={(e) => handlerChangePrice(e.target, e.target.value)}/>
                    </div>
                    <button className={"button w-20 px-2.5 pb-2.5 mt-2 h-8"} onClick={handlerAcceptFilters}>Accept</button>
                    <button className={"button w-20 px-2.5 pb-2.5 mt-2 h-8"} onClick={handlerResetFilters}>Reset</button>
                </div>
                {/*TODO make slider with 2 ranges*/}
                {/*<input type={"range"}*/}
                {/*       min={filterPrice.valueFrom ? filterPrice.valueFrom : 0}*/}
                {/*       max={filterPrice.valueTo ? filterPrice.valueTo : 10000}*/}
                {/*       value={0}/>*/}
            </div>
        </>
    )
}