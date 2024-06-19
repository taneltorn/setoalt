import React from 'react';
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import PNGExport from "../common/export/PNGExport.tsx";
import {useAuth} from "../../../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const ScoreDetailsControls: React.FC = () => {

    const [t] = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <Group gap={"xs"} justify={"end"}>
            <PNGExport/>

            {auth.currentUser?.isAuthorized &&
                <Button size={"md"}
                        variant={"outline"}
                        onClick={() => navigate("edit")}>
                    {t("button.edit")}
                </Button>}
        </Group>
    )
};

export default ScoreDetailsControls;
