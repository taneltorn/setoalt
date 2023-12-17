import {Button, Stack, Text, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import TextLink from "../components/common/TextLink.tsx";
import React from "react";
import {Link} from "react-router-dom";
import ScoreTable from "./ScoreTable.tsx";

const ScoreDetails: React.FC = () => {

    const {t} = useTranslation();

    return (
        <>
            <Title order={1} mb={"xs"}>{t("view.scores.title")}</Title>
            <Text mb={"lg"}>{t("view.scores.description")}</Text>

            <Title order={4} mt={"xl"} mb={"sm"}>Helilaadid</Title>
            <Stack gap={4}>
                <TextLink to={"/scores/ppt"} label={"Pooltoon-poolteisttoon"}/>
                <TextLink to={"/scores/diatonic"} label={"Diatooniline"}/>
                <TextLink to={"/scores/old-diatonic"} label={"Vanem diatooniline"}/>
            </Stack>

            <Title order={4} mt={"xl"} mb={"sm"}>Lood</Title>

            <ScoreTable rows={[
                {id: "pollulaul", title: "Põllulaul", stave: "PPT", voices: ["torrõ", "killõ"]},
                {id: "jarvelaul", title: "Järvelaul", stave: "PPT", voices: ["torrõ", "killõ"]},
                {id: "varavalaul", title: "Väravalaul", stave: "Diatooniline", voices: ["torrõ"]}
            ]}/>

            <Link to={"/editor"}>
                <Button mt={"md"}>Lisa uus</Button>
            </Link>

        </>
    );
}

export default ScoreDetails;
