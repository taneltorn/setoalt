import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Stave} from "../../../../../models/Stave.ts";
import {Button, Card, Group} from "@mantine/core";
import {StavePPT} from "../../../../../staves/StavePPT.ts";
import {StaveOldDiatonic} from "../../../../../staves/StaveOldDiatonic.ts";
import {StaveDiatonic} from "../../../../../staves/StaveDiatonic.ts";
import StavePreview from "../../common/stave/StavePreview.tsx";

const StaveSelectionDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const [stave, setStave] = useState<Stave>(context.score.data.stave);

    const handleSave = () => {
        context.score.data.stave = stave;
        context.refresh();
        close();
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
            type={DialogType.STAVE_SELECTION}
            size={"xl"}
            title={t("dialog.staveSelection.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Group className={"hover-pointer"} wrap={"nowrap"}>
                {[StavePPT, StaveOldDiatonic, StaveDiatonic].map((s, index) =>
                    <Card onClick={() => setStave(s)} p={"xl"} shadow={"md"}>
                        <Card.Section opacity={s.name === stave.name ? 1 : 0.3}>
                            <StavePreview
                                key={index}
                                stave={s}
                            />
                        </Card.Section>
                        <Card.Section>
                            <Button
                                fullWidth
                                variant={s.name === stave.name ? "filled" : "light"}
                                color={s.name === stave.name ? "black" : "gray.8"}
                            >
                                {t(`stave.${s.name.toLowerCase()}`)}
                            </Button>
                        </Card.Section>
                    </Card>)}
            </Group>
        </Dialog>
    )
};

export default StaveSelectionDialog;
