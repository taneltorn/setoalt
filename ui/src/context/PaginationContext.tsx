import React from 'react';

export const ItemsPerPageOptions = [10, 20, 50];

export interface PaginationContextProperties {
    page: number;
    setPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
}

export const PaginationContext = React.createContext<PaginationContextProperties>({} as PaginationContextProperties);
