import {useCallback, useState} from "react";
import {usePagination} from "./usePagination.tsx";

const useSearchQuery = () => {

    const {setPage} = usePagination();

    const [query, setQuery] = useState<string>("");

    const setQueryWithPageReset = useCallback((value: string) => {
        setQuery(value);
        setPage(1);
    }, []);

    return {
        query,
        setQuery: setQueryWithPageReset,
    };
}

export default useSearchQuery;
