import React, {useEffect, useState} from "react";
import {Score} from "../../models/Score.ts";
import ScoreContextProvider from "../../context/ScoreContextProvider.tsx";
import {useParams} from "react-router";
import useScoreService from "../../services/ScoreService.tsx";
import KeyPressHandler from "../../components/KeyPressHandler.tsx";
import ScoreDevInfo from "../../components/ScoreDevInfo.tsx";
import {useDevMode} from "../../context/DevModeContext.tsx";
import {useTranslation} from "react-i18next";
import {DisplayError} from "../../utils/helpers.tsx";
import LoadingOverlay from "../../components/LoadingOverlay.tsx";
import NoDataAlert from "../../components/NoDataAlert.tsx";
import ScoreDetails from "./components/ScoreDetails.tsx";
import ScoreDialogs from "./components/dialog/ScoreDialogs.tsx";
import ScoreEditor from "./components/ScoreEditor.tsx";
import CleanEditor from "./components/CleanEditor.tsx";

interface Properties {
    mode: "details" | "edit" | "new";
}

const ScoreManager: React.FC<Properties> = ({mode}) => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [score, setScore] = useState<Score>();
    const [noData, setNoData] = useState<boolean>(false);
    const params = useParams();
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
            <LoadingOverlay isLoading={scoreService.isLoading}>
                <NoDataAlert
                    visible={noData}
                    goBackUrl={"/scores"}
                    goBackText={t("view.scores.details.back")}
                />

                {mode === "details" && score && <ScoreDetails score={score}/>}
                {mode === "edit" && score && <ScoreEditor score={score}/>}
                {mode === "new" && <CleanEditor/>}

                {isDevMode && <ScoreDevInfo/>}
            </LoadingOverlay>

            <KeyPressHandler/>
            <ScoreDialogs/>
        </ScoreContextProvider>
    );
}

export default ScoreManager;
