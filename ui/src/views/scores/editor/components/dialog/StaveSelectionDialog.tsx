import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Stave} from "../../../../../model/Stave.ts";
import {ActionIcon, Button, Card, Group} from "@mantine/core";
import {StavePPT} from "../../../../../staves/StavePPT.ts";
import {StaveOldDiatonic} from "../../../../../staves/StaveOldDiatonic.ts";
import {StaveDiatonic} from "../../../../../staves/StaveDiatonic.ts";
import StavePreview from "../../../details/components/stave/StavePreview.tsx";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {DialogType} from "../../../../../utils/enums.ts";
import StaveCreator from "../StaveCreator.tsx";
import {StaveCustom} from "../../../../../staves/StaveCustom.ts";
import {Size} from "../../../../../utils/constants.ts";
import {FaPlayCircle} from "react-icons/fa";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";

const StaveSelectionDialog: React.FC = () => {

    const [t] = useTranslation();

    const context = useScoreContext();
    const {playStaveScale} = useAudioContext();
    const {close} = useDialogContext();
    const history = useHistory();

    const [linesWithError, setLinesWithError] = useState<number[]>([]);

    const [customStave, setCustomStave] = useState<Stave>(context.score.data.stave.name === "Custom" ? context.score.data.stave : StaveCustom);
    const [stave, setStave] = useState<Stave>(context.score.data.stave);

    const handleSave = () => {
        if (stave.name === "Custom") {

            const errors: number[] = [];
            stave.lines.forEach((l, i) => {
                if (l.pitch === "") {
                    errors.push(i);
                }
            });
            setLinesWithError(errors);
            if (errors.length > 0) {
                return;
            }
        }

        setLinesWithError([]);
        history.snapshot(context);
        context.score.data.stave = stave;
        context.refresh();
        close();
    }

    const handleStaveChange = (stave: Stave) => {
        setCustomStave(stave);
        setStave(stave);
    }

    const handleClose = () => {
        setStave(context.score.data.stave);
        close();
    }

    useEffect(() => {
        setStave(context.score.data.stave);
    }, [context.score.data.stave]);

    return (
        <Dialog
            w={"100%"}
            type={DialogType.STAVE_SELECTION}
            title={t("dialog.staveSelection.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Group className={"hover-pointer"}>
                {[StavePPT, StaveOldDiatonic, StaveDiatonic, customStave].map((s, index) =>
                    <Card
                        key={`stave-${s.name}`}
                        p={"xl"}
                        shadow={s.name === stave.name ? "xl" : "xs"}
                        onClick={() => setStave(s)}
                    >
                        <Card.Section opacity={s.name === stave.name ? 1 : 0.2}>
                            <StavePreview
                                width={150}
                                key={index}
                                stave={s}
                            />
                        </Card.Section>
                        <Card.Section>
                            <Group wrap={"nowrap"}>
                                <ActionIcon
                                    size={Size.icon.SM}
                                    onClick={() => playStaveScale(s)}
                                    title={t("button.listen")}
                                    c={"white"}
                                >
                                    {<FaPlayCircle size={Size.icon.XL}/>}
                                </ActionIcon>
                                <Button
                                    fullWidth
                                    variant={s.name === stave.name ? "filled" : "light"}
                                    color={s.name === stave.name ? "black" : "gray.8"}
                                >
                                    {t(`stave.${s.name.toLowerCase()}`)}
                                </Button>
                            </Group>
                        </Card.Section>
                    </Card>)}
            </Group>

            {stave.name === "Custom" &&
                <StaveCreator
                    stave={customStave}
                    setStave={handleStaveChange}
                    linesWithError={linesWithError}
                />}
        </Dialog>
    )
};

export default StaveSelectionDialog;
