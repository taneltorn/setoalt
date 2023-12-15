import React from 'react';
import {StavePPT} from "../../staves/StavePPT";
import StavePreview from "../stave/StavePreview";
import {StaveDiatonic} from "../../staves/StaveDiatonic";
import {StaveOldDiatonic} from "../../staves/StaveOldDiatonic";
import {Stave} from "../../models/Stave";
import {Button, Card, Group} from "@mantine/core";
import {useTranslation} from "react-i18next";

interface Properties {
    activeStave: Stave;
    onSelect: (stave: Stave) => void;
}

const StaveSelection: React.FC<Properties> = ({activeStave, onSelect}) => {

    const [t] = useTranslation();

    return (
        <Group display={"flex"} justify={"space-between"} className={"hover-pointer"}>
            {[StavePPT, StaveDiatonic, StaveOldDiatonic].map((stave, index) =>
                <Card onClick={() => onSelect(stave)} p={"xl"} shadow={"md"}>
                    <Card.Section opacity={stave.name === activeStave.name ? 1 : 0.3}>
                        <StavePreview
                            key={index}
                            stave={stave}
                        />
                    </Card.Section>
                    <Card.Section>
                        <Button
                            fullWidth
                            variant={stave.name === activeStave.name ? "filled" : "light"}
                            color={stave.name === activeStave.name ? "black" : "gray.8"}
                        >
                            {t(`stave.${stave.name.toLowerCase()}`)}
                        </Button>
                    </Card.Section>

                </Card>)}
        </Group>
    )
};

export default StaveSelection;
