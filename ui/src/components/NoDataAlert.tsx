import React from "react";
import {Alert, Group, Text} from "@mantine/core";
import {IoIosWarning} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

interface Properties {
    visible?: boolean;
    text?: string;
    goBackUrl?: string;
    goBackText?: string;
}

const NoDataAlert: React.FC<Properties> = (props) => {

    const {t} = useTranslation();

    return (
        <>
            {props.visible &&
                <Alert mb={"md"} icon={<IoIosWarning size={40}/>}>
                    <Group>
                        <Text>{props.text || t("page.noData")}</Text>
                        {props.goBackUrl &&
                            <Link to={props.goBackUrl}>
                                <Text>{props.goBackText || t("page.goBack")}</Text>
                            </Link>}
                    </Group>
                </Alert>}
        </>
    );
}

export default NoDataAlert;
