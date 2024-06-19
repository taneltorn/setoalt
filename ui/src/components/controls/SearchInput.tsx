import React, {useState} from "react";
import {CloseButton, Input,} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {CiSearch} from "react-icons/ci";

interface Properties {
    isLoading?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    onClear?: () => void;
}

const SearchInput: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const [search, setSearch] = useState("");

    const handleChange = (value: string) => {
        setSearch(value);
        props.onChange && props.onChange(value);
    }

    const handleClear = () => {
        setSearch("");
        props.onClear && props.onClear();
    }

    return (
        <Input
            size={"lg"}
            value={search}
            placeholder={props.placeholder || t("placeholder.search")}
            onChange={e => handleChange(e.currentTarget.value)}
            leftSection={<CiSearch size={24}/>}
            rightSectionPointerEvents="all"
            rightSection={
                <CloseButton
                    className={"hover-pointer"}
                    onClick={handleClear}
                    style={{display: search ? undefined : 'none'}}
                />
            }/>
    );
}

export default SearchInput;
