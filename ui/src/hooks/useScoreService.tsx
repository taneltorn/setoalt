import {Score} from "../model/Score.ts";
import axios from 'axios';
import {normalize} from "../utils/helpers.tsx";
import {useDataService} from "./useDataService.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const useScoreService = () => {

    const {isLoading, setIsLoading, isSaving, setIsSaving} = useDataService();
    const cancelSource = axios.CancelToken.source();

    const fetchScore = async (id: string): Promise<Score> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/scores/${id}`, {
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
                setIsLoading(false);
                throw error;
            });
    }

    const fetchScores = async (): Promise<Score[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/scores`, {
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
                setIsLoading(false);
                throw error;
            });
    }

    const createScore = async (score: Score): Promise<Score> => {
        setIsSaving(true);
        return axios.post(`${API_URL}/api/scores`, normalize(score), {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
                setIsSaving(false);
                throw error;
            });
    }

    const updateScore = async (id: number, score: Score): Promise<Score> => {
        setIsSaving(true);
        return axios.put(`${API_URL}/api/scores/${id}`, normalize(score), {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
                setIsSaving(false);
                throw error;
            });
    }

    const removeScore = async (id: number): Promise<Score> => {
        setIsSaving(true);
        return axios.delete(`${API_URL}/api/scores/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsSaving(false);
                return response.data;
            })
            .catch(error => {
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
        updateScore,
        removeScore,
        cancelSource
    }
};

export default useScoreService;
