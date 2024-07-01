import {useState} from "react";
import {PaginationFilter} from "../model/PaginationFilter.ts";

const usePagination = () => {

    const [pagination, setPagination] = useState<PaginationFilter>({
        page: 1,
        itemsPerPage: 10,
        query: ""
    });

    return {
        pagination, setPagination,
    }
};

export default usePagination;
