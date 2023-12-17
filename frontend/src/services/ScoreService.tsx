import {useState} from "react";
import {notifications} from '@mantine/notifications';
import {IoMdAlert} from "react-icons/io";

const useScoreService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchScore = async (id: string, onSuccess: (data: any) => void): Promise<any> => {
        setIsLoading(true);
        fetch(`http://localhost:4000/scores/${id}`)
            .then(response => response.json())
            .then(data => {
                onSuccess(data);
            })
            .catch(e => notifications.show({
                title: "Viga!",
                message: "Lugu ei leitud.",
                icon: <IoMdAlert color={"red"} size={40}/>,
                color: "white"
                // style: { backgroundColor: '', color: "white" },

            }))
            .finally(() => setIsLoading(false));

    }

    return {
        isLoading,
        fetchScore
    }
};

export default useScoreService;
