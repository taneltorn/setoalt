import {useState} from "react";

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchScore = async (id: string): Promise<any> => {
        setIsLoading(true);
        return fetch(`http://localhost:3000/scores/${id}`)
            .then(response => {
                setIsLoading(false);
                return response.json();
            });
    }

    const fetchScores = async (): Promise<any> => {
        setIsLoading(true);
        return fetch(`http://localhost:3000/scores`)
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
