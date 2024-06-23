import React from "react";
import {Box, Button, Group, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {mdiMusicNoteOff} from '@mdi/js';
import Icon from "@mdi/react";
import {Link} from "react-router-dom";

const ScoreNotFound: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    return (
        <Box py={"xl"}>
            <Group justify={"center"}>
                <Icon
                    path={mdiMusicNoteOff}
                    color={theme.colors.gray[2]}
                    size={5}
                />
            </Group>
            <Group justify={"center"}>
                <Text c={"gray.3"}>
                    {t("view.scores.notFound.text")}
                </Text>
            </Group>
            <Group justify={"center"} mt={"xl"}>
                <Link to={"/scores"}>
                    <Button variant={"outline"} color={"gray"}>
                        {t("view.scores.notFound.goBack")}
                    </Button>
                </Link>
            </Group>
        </Box>
    );
}

export default ScoreNotFound;
