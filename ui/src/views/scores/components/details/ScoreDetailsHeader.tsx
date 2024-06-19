import React from 'react';
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {Badge, Group, Title, useMantineTheme} from "@mantine/core";
import {Link} from "react-router-dom";
import {IoChevronBack} from "react-icons/io5";

const ScoreDetailsHeader: React.FC = () => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const {score} = useScoreContext();

    return (
        <Group gap={"xs"}>
            <Link to={"/scores"} style={{display: "flex"}}>
                <IoChevronBack size={32}/>
            </Link>

            <Title mr={"lg"} order={1}>
                {score?.name}
            </Title>

            <Badge bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                {t(`visibility.${score?.visibility?.toLowerCase()}`)}
            </Badge>
        </Group>
    )
};

export default ScoreDetailsHeader;
