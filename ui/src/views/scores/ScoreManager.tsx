import React, {useEffect, useState} from "react";
import {Score} from "../../model/Score.ts";
import {useParams} from "react-router";
import useScoreService from "../../hooks/useScoreService.tsx";
import KeyPressHandler from "../../components/KeyPressHandler.tsx";
import DevInfo from "../../components/DevInfo.tsx";
import {useDevMode} from "../../hooks/useDevContext.tsx";
import LoadingOverlay from "../../components/LoadingOverlay.tsx";
import ScoreNotFound from "./ScoreNotFound.tsx";
import ScoreDetails from "./details/ScoreDetails.tsx";
import ScoreDialogs from "./details/components/ScoreDialogs.tsx";
import ScoreEditor from "./editor/ScoreEditor.tsx";
import Editor from "./editor/Editor.tsx";
import ScoreEmbedding from "./embed/ScoreEmbedding.tsx";
import ContextProviders from "../../ContextProviders.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Role} from "../../utils/enums.ts";

interface Properties {
    mode: "details" | "edit" | "new" | "embed" | "embed-new";
}

const ScoreManager: React.FC<Properties> = ({mode}) => {

    const scoreService = useScoreService();
    const [score, setScore] = useState<Score>();
    const [noData, setNoData] = useState<boolean>(false);
    const params = useParams();
    const {isDevMode} = useDevMode();
    const auth = useAuth();

    useEffect(() => {
        if (!params.id) {
            return;
        }

        scoreService.fetchScore(params.id)
            .then(r => {
                setScore(r);
            })
            .catch(() => setNoData(true));

        return () => scoreService.cancelSource.cancel();
    }, [params.id]);

    return (
        <ContextProviders>
            <LoadingOverlay isLoading={scoreService.isLoading}>
                {mode !== "embed" && noData && <ScoreNotFound/>}

                {mode === "details" && score && <ScoreDetails score={score}/>}
                {mode === "edit" && score
                    && (auth.currentUser?.role !== Role.USER || score.createdBy === auth.currentUser?.username)
                    && <ScoreEditor score={score}/>}
                {mode === "new" && <Editor/>}
                {mode === "embed" && score && <ScoreEmbedding score={score}/>}
                {mode === "embed-new" && <ScoreEmbedding isEditMode/>}

                {isDevMode && <DevInfo/>}
            </LoadingOverlay>

            <KeyPressHandler/>
            <ScoreDialogs/>
        </ContextProviders>
    );
}

export default ScoreManager;
