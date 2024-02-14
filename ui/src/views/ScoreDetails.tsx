import React, {useEffect, useState} from "react";
import {Alert, Group, Loader, Text, useMantineTheme} from "@mantine/core";
import {Score} from "../models/Score.ts";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import {useParams} from "react-router";
import useScoreService from "../services/ScoreService.tsx";
import StaveSkeleton from "../components/stave/StaveSkeleton.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import {IoIosWarning} from "react-icons/io";
import EditScoreForm from "../components/form/EditScoreForm.tsx";
import ScoreInfo from "../components/ScoreInfo.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";
import {useTranslation} from "react-i18next";
import {DisplayError} from "../utils/helpers.tsx";
import {Link} from "react-router-dom";
import {FaAngleLeft} from "react-icons/fa6";
import RemoveScoreDialog from "../components/dialog/RemoveScoreDialog.tsx";

interface Properties {
    isEditMode?: boolean;
}

const ScoreDetails: React.FC<Properties> = ({isEditMode}) => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [score, setScore] = useState<Score>();
    const [noData, setNoData] = useState<boolean>(false);
    const params = useParams();
    const theme = useMantineTheme();
    const {isDevMode} = useDevMode();

    useEffect(() => {
        if (!params.id) {
            return;
        }

        scoreService.fetchScore(params.id)
            .then(r => {
                setScore(r);
            })
            .catch(() => {
                DisplayError(t("toast.error.title"), t("toast.error.fetchScore"));
                setNoData(true);
            });

        return () => scoreService.cancelSource.cancel();
    }, []);

    return (
        <ScoreContextProvider>
            <KeyPressHandler/>

            {noData && <>
                <Alert mb={"md"} color={"red"} icon={<IoIosWarning size={40}/>}>
                    <Text fw={500}>{t("view.scores.details.noData")}</Text>
                </Alert>
                <Link to={"/scores"}>
                    <Group>
                        <FaAngleLeft size={24} color={theme.primaryColor}/>
                        <Text size={"lg"}>{t("view.scores.details.back")}</Text>
                    </Group>
                </Link>
            </>}

            {scoreService.isLoading && <>
                <Loader/>
                <StaveSkeleton/>
            </>}

            {score && !scoreService.isLoading && <>
                <EditScoreForm
                    score={score}
                    isOpen={isEditMode}
                />

                {isDevMode && <ScoreInfo/>}

                <TransposeDialog/>
                <RemoveScoreDialog/>
            </>}

        </ScoreContextProvider>
    );
}

export default ScoreDetails;
