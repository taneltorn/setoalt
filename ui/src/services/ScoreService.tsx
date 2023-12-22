import {useState} from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchScore = async (id: string): Promise<any> => {
        setIsLoading(true);
        return fetch(`${BACKEND_URL}/scores/${id}`)
            .then(response => {
                setIsLoading(false);
                return response.json();
            });
    }

    const fetchScores = async (): Promise<any> => {
        setIsLoading(true);
        return fetch(`${BACKEND_URL}/scores`)
            .then(response => {
                setIsLoading(false);
                return response.json();
            });
    }

    return {
        isLoading,
        fetchScore,
        fetchScores
    }
};

export default useScoreService;
