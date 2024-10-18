import React, {useContext, useMemo, useState} from "react";
import useLocalStorage from "./useLocalStorage.tsx";
import {isEmpty} from "../utils/helpers.tsx";
import {ItemsPerPageOptions, PaginationContext} from "../context/PaginationContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const PaginationContextProvider: React.FC<Properties> = ({children}) => {

    const [page, setPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useLocalStorage<number>("itemsPerPage", ItemsPerPageOptions[0]);

    const context = useMemo(() => ({
        page, setPage,
        itemsPerPage, setItemsPerPage,
    }), [page, itemsPerPage]);

    return (
        <PaginationContext.Provider value={context}>
            {children}
        </PaginationContext.Provider>);
}

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (isEmpty(context)) {
        throw new Error('usePagination must be used within a PaginationContextProvider')
    }

    return context;
};
