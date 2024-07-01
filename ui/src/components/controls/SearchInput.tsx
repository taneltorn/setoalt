import React from "react";
import {CloseButton, Input,} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {CiSearch} from "react-icons/ci";
import {Size} from "../../utils/constants.ts";

interface Properties {
    isLoading?: boolean;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onClear?: () => void;
}

const SearchInput: React.FC<Properties> = (props) => {

    const {t} = useTranslation();

    return (
        <Input
            size={"md"}
            value={props.value}
            placeholder={props.placeholder || t("page.search")}
            onChange={e => props.onChange(e.currentTarget.value)}
            leftSection={<CiSearch size={Size.icon.SM}/>}
            rightSectionPointerEvents="all"
            rightSection={
                <CloseButton
                    className={"hover-pointer"}
                    onClick={props.onClear}
                    style={{display: props.value ? undefined : 'none'}}
                />
            }/>
    );
}

export default SearchInput;
