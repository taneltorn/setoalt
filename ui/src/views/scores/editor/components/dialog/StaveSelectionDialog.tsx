import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Stave} from "../../../../../model/Stave.ts";
import {ActionIcon, Button, Card, Center, Group} from "@mantine/core";
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

    const [customStave, setCustomStave] = useState<Stave>(context.score.data.stave.name === "Custom" ? context.score.data.stave : StaveCustom);
    const [showCustomEditor, setShowCustomEditor] = useState<boolean>(false);
    const [stave, setStave] = useState<Stave>(context.score.data.stave);

    const handleSave = () => {
        history.snapshot(context);
        context.score.data.stave = stave;
        context.refresh();
        close();
    }

    const handleConfirm = (stave: Stave) => {
        setCustomStave(stave);
        setStave(stave);
        setShowCustomEditor(false);
    }

    const handleCustomStaveClick = (stave: Stave) => {
        setStave(stave);
        setShowCustomEditor(true);
    }

    const handleCloseCustomEditor = () => {
        setStave(context.score.data.stave);
        setShowCustomEditor(false);
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
            size={"xl"}
            type={DialogType.STAVE_SELECTION}
            title={t("dialog.staveSelection.title")}
            primaryButtonLabel={t("button.save")}
            hidePrimaryButton={showCustomEditor}
            hideSecondaryButton={showCustomEditor}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >

            {showCustomEditor
                ? <StaveCreator
                    stave={customStave}
                    setStave={setCustomStave}
                    onConfirm={handleConfirm} onClose={handleCloseCustomEditor}/>
                : <>
                    <Center>
                        <Group className={"hover-pointer"}>
                            {[StavePPT, StaveOldDiatonic, StaveDiatonic].map((s, index) =>
                                <Card
                                    key={`stave-${s.name}`}
                                    p={"xl"}
                                    shadow={"md"}
                                    onClick={() => setStave(s)}
                                >
                                    <Card.Section opacity={s.name === stave.name ? 1 : 0.3}>
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
                    </Center>

                    <Center>
                        <Card
                            className={"hover-pointer"}
                            mt={"md"}
                            p={"xl"}
                            w={250}
                            shadow={"md"}
                            onClick={() => handleCustomStaveClick(customStave)}
                        >
                            <Card.Section opacity={context.score.data.stave.name === "Custom" ? 1 : 0.3}>
                                <StavePreview width={150} stave={customStave}/>
                            </Card.Section>
                            <Card.Section>
                                <Button
                                    fullWidth
                                    variant={stave.name === "Custom" ? "filled" : "light"}
                                    color={stave.name === "Custom" ? "black" : "gray.8"}
                                >
                                    {t(`stave.custom`)}
                                </Button>
                            </Card.Section>
                        </Card>
                    </Center>
                </>}
        </Dialog>
    )
};

export default StaveSelectionDialog;
