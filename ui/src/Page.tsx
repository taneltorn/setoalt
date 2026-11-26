import React, {useEffect} from "react";
import {Size} from "./utils/constants.ts";
import {useTranslation} from "react-i18next";

interface Properties {
    title?: string;
    children: React.ReactNode;
}

const Page: React.FC<Properties> = ({children, title}) => {

    const {t} = useTranslation();

    useEffect(() => {
        document.title = `${title + " - " || ""}${t("page.title")}`;
    }, [title]);

    return (
        <div style={{maxWidth: Size.page.MAX_WIDTH}}>
            {children}
        </div>
    )
}

export default Page
