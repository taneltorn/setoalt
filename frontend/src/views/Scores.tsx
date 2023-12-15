import {Title} from "@mantine/core";
import {useEffect} from "react";

const Scores: React.FC = () => {

    useEffect(() => {
        fetch("http://localhost:4000/score")
            .then((r) => {
                console.log(r)
            })
            .catch(e => console.log(e))
    }, []);

    return (
        <>
            <Title order={2}>Scores</Title>
        </>
    );
}

export default Scores;
