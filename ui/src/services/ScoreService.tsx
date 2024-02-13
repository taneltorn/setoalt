import {useState} from "react";
import {Score} from "../models/Score.ts";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                setIsLoading(false);
                throw error;
            });
    }

    const createScore = async (score: Score): Promise<Score> => {
        setIsLoading(true);
        return axios.post(`${API_URL}/scores`, score, {
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

    const updateScore = async (id: number, score: Score): Promise<Score> => {
        setIsLoading(true);
        return axios.put(`${API_URL}/scores/${id}`, score, {
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

    return {
        isLoading,
        fetchScore,
        fetchScores,
        createScore,
        updateScore
    }
};

export default useScoreService;
