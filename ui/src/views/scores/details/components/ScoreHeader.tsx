import React from "react";
import {Group} from "@mantine/core";
import {Score} from "../../../../model/Score.ts";
import Header from "../../../../components/controls/Header.tsx";
import {useTranslation} from "react-i18next";
import ScoreControls from "../../editor/components/controls/ScoreControls.tsx";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import BackLink from "../../../../components/controls/BackLink.tsx";
import {useAudioContext} from "../../../../hooks/useAudioContext.tsx";
import {Role} from "../../../../utils/enums.ts";

interface Properties {
    score: Score;
}

const ScoreHeader: React.FC<Properties> = ({score}) => {

    const [t] = useTranslation();

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
                <ScoreControls
                    primaryButtonLabel={t("button.edit")}
                    primaryButtonVariant={"outline"}
                    secondaryButtonVariant={"outline"}
                    onPrimaryButtonClick={handleEditClick}
                    hidePrimaryButton={!(score.createdBy === auth.currentUser?.username
                        || [Role.ADMIN, Role.EDITOR].includes(auth.currentUser?.role as Role))}
                    hideSecondaryButton
                />
            </>
            }>
            <Group>
                {score.name}
            </Group>
        </Header>
    );
}

export default ScoreHeader;
