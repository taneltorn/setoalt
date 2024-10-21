import React from "react";
import {Badge, Group, useMantineTheme} from "@mantine/core";
import {Score} from "../../../../model/Score.ts";
import Header from "../../../../components/controls/Header.tsx";
import {useTranslation} from "react-i18next";
import ScoreControls from "../../editor/components/controls/ScoreControls.tsx";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import BackLink from "../../../../components/controls/BackLink.tsx";
import {useAudioContext} from "../../../../hooks/useAudioContext.tsx";

interface Properties {
    score: Score;
}

const ScoreHeader: React.FC<Properties> = ({score}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {stopPlayback} = useAudioContext();

    const handleEditClick = () => {
        stopPlayback();
        navigate("edit");
    }

    return (
        <Header
            leftSection={<BackLink to={"/scores"} state={location.state}/>}
            rightSection={<>
                {auth.currentUser?.isAuthorized &&
                    <ScoreControls
                        primaryButtonLabel={t("button.edit")}
                        primaryButtonVariant={"outline"}
                        secondaryButtonVariant={"outline"}
                        onPrimaryButtonClick={handleEditClick}
                        hideSecondaryButton
                    />}
            </>
            }>
            <Group>
                {score.name}
                <Badge py={"sm"}
                       bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                    {t(`visibility.${score?.visibility?.toLowerCase()}`)}
                </Badge>
            </Group>
        </Header>
    );
}

export default ScoreHeader;
