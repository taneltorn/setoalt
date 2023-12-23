import {useState} from "react";

// todo move under conf
const API_URL = "http://104.248.100.79:3000";

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchScore = async (id: string): Promise<any> => {
        setIsLoading(true);
        return fetch(`${API_URL}/api/scores/${id}`)
            .then(response => {
                setIsLoading(false);
                return response.json();
            });
    }

    const fetchScores = async (): Promise<any> => {

        setIsLoading(true);
        return fetch(`${API_URL}/api/scores`)
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
