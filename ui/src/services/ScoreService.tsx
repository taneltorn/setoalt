import {useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchScore = async (id: string): Promise<any> => {
        setIsLoading(true);
        return fetch(`${API_URL}/scores/${id}`)
            .then(response => {
                setIsLoading(false);
                return response.json();
            });
    }

    const fetchScores = async (): Promise<any> => {
        setIsLoading(true);
        return fetch(`${API_URL}/scores`, {
            credentials: "include"
        })
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
