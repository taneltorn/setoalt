import React, {useEffect, useMemo, useState} from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {useTranslation} from "react-i18next";
import {Button, Code, Grid, Group, Input, Text, TextInput} from "@mantine/core";
import {DialogType, useDialogContext} from "../../../../context/DialogContext.tsx";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {Layout, Size} from "../../../../utils/constants.ts";
import {TbArrowAutofitHeight, TbArrowAutofitWidth} from "react-icons/tb";
import {MdOutlineContentCopy} from "react-icons/md";

const EmbedScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close} = useDialogContext();
    const context = useScoreContext();

    const [copied, setCopied] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(Layout.stave.container.MAX_WIDTH);
    const [height, setHeight] = useState<number>(context.dimensions.containerY);

    const code = useMemo(() => {
        return `<iframe src="${window.location.origin}/embed/${context.score.id}" width="${width}" height="${height}" title="${context.score.name}"></iframe>`;
    }, [width, height, context.score]);

    // Implementing manually, Mantine's CopyButton doesn't seem to work in certain cases
    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(code);
        setTimeout(() => setCopied(false), 1000);
    }

    useEffect(() => {
        setWidth(context.dimensions.x);
        setHeight(context.dimensions.containerY);
    }, [context.dimensions]);


    return (
        <Dialog
            size={"lg"}
            type={DialogType.EMBED_SCORE}
            title={t("dialog.embedScore.title")}
            hideSecondaryButton
            hidePrimaryButton
            onClose={close}
        >
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.embedScore.description")}
            </Text>

            <Grid>
                <Grid.Col span={{xs: 12, sm: 6}}>
                    <Input.Wrapper size={"xl"}>
                        <TextInput
                            leftSection={<TbArrowAutofitWidth size={Size.icon.MD}/>}
                            size={"xl"}
                            placeholder={t("view.editor.form.name")}
                            value={width}
                            onChange={e => setWidth(+e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                </Grid.Col>
                <Grid.Col span={{xs: 12, sm: 6}}>

                    <Input.Wrapper size={"xl"}>
                        <TextInput
                            leftSection={<TbArrowAutofitHeight size={Size.icon.MD}/>}
                            size={"xl"}
                            placeholder={t("view.editor.form.name")}
                            value={height}
                            onChange={e => setHeight(+e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                </Grid.Col>
            </Grid>

            <Group mt={"md"}>
                <Code block style={{whiteSpace: "pre-wrap"}}>
                    <Text fz={"xl"}>
                        {code}
                    </Text>
                </Code>
            </Group>

            <Group justify={"end"} gap={4} mt={"xl"}>
                <Button
                    size={"md"}
                    variant={"subtle"}
                    color={"black"}
                    onClick={close}>
                    {t("button.close")}
                </Button>

                <Button
                    color={copied ? 'teal' : 'red'}
                    size={"md"}
                    leftSection={!copied && <MdOutlineContentCopy size={Size.icon.SM}/>}
                    onClick={handleCopy}>
                    {t(`button.${copied ? "copied" : "copy"}`)}
                </Button>
            </Group>
        </Dialog>
    )
};

export default EmbedScoreDialog;
