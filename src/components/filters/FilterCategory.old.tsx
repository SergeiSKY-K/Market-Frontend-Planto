import {DATA_FOR_FILTERS, type FILTER_PROPS} from "../../utils/constants.ts";

const FilterCategoryOld = (props: FILTER_PROPS) => {

    const handlerCheckCategory = (value: string, checked: boolean) => {

        const currFilter = props.filter;
        const arr = currFilter.valueList.slice(0, currFilter.valueList.length);

        if (checked) {
            arr.push(value);
        } else {
            const index = arr.indexOf(value, 0);
            if (index >= 0) {
                arr.splice(index, 1);
            }
        }
        props.setFilter((prevState) => prevState.getCopy({valueList: arr}));
    }

    return (
        <div className={"flex flex-row items-center space-x-1"}>
            <label className={"text-base-text mr-2"}>Filter by category:</label>
            {/*TODO change to the select field with multiple selection*/}
            {DATA_FOR_FILTERS.categories.map(category => <>
                <input
                    type={"checkbox"}
                    className={"inputFieldTable"}
                    value={category!}
                    key={category}
                    checked={props.filter.valueList!.includes(category, 0)}
                    onChange={(e) => handlerCheckCategory(e.target.value, e.target.checked)}
                />
                <label className={"text-base-text mr-3"}>
                    {category}
                </label>
            </>)}
        </div>
    )
}

export default FilterCategoryOld;