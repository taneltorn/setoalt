import {Score} from "../model/Score.ts";
import axios from 'axios';
import {DisplayError, DisplaySuccess, normalize} from "../utils/helpers.tsx";
import {useDataService} from "./useDataService.tsx";
import {useTranslation} from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const useScoreService = () => {

    const {t} = useTranslation();

    const {isLoading, setIsLoading, isSaving, setIsSaving} = useDataService();
    const cancelSource = axios.CancelToken.source();

    const fetchScore = async (id: string): Promise<Score> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/scores/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.score.fetchScore"), error);

                setIsLoading(false);
                throw error;
            });
    }

    const fetchScores = async (): Promise<Score[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/scores`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.score.fetchScores"), error);

                setIsLoading(false);
                throw error;
            });
    }

    const createScore = async (score: Score): Promise<Score> => {
        setIsSaving(true);
        return axios.post(`${API_URL}/scores`, normalize(score), {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.score.saveScore"));

                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.score.saveScore"), error);

                setIsSaving(false);
                throw error;
            });
    }

    const cloneScore = async (name: string, score: Score): Promise<Score> => {
        const clone = {...score};
        clone.name = name;

        return createScore(clone);
    }

    const updateScore = async (id: number, score: Score): Promise<Score> => {
        setIsSaving(true);
        return axios.put(`${API_URL}/scores/${id}`, normalize(score), {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.score.saveScore"));

                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.score.removeScore"), error);

                setIsSaving(false);
                throw error;
            });
    }

    const removeScore = async (id: number): Promise<Score> => {
        setIsSaving(true);
        return axios.delete(`${API_URL}/scores/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.score.removeScore"));

                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.score.removeScore"), error);

                setIsSaving(false);
                throw error;
            });
    }

    return {
        isLoading,
        isSaving,
        fetchScore,
        fetchScores,
        createScore,
        cloneScore,
        updateScore,
        removeScore,
        cancelSource,
    }
};

export default useScoreService;
