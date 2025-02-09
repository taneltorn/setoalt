import React, {useEffect, useMemo, useState} from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {useTranslation} from "react-i18next";
import {Button, Code, CopyButton, Grid, Group, Input, Switch, Text, TextInput} from "@mantine/core";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {useScoreContext} from "../../../../hooks/useScoreContext.tsx";
import {Size} from "../../../../utils/constants.ts";
import {TbArrowAutofitHeight, TbArrowAutofitWidth} from "react-icons/tb";
import {MdOutlineContentCopy} from "react-icons/md";
import {DialogType} from "../../../../utils/enums.ts";
import {calculateEmbeddingHeight} from "../../../../utils/calculation.helpers.tsx";

const EmbedScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close} = useDialogContext();
    const context = useScoreContext();

    const [simplified, setSimplified] = useState<boolean>(false);
    const [position, setPosition] = useState<string>("");
    const [width, setWidth] = useState<string>("100%");
    const [height, setHeight] = useState<string>(`${context.dimensions.containerY + 1250}`);

    const code = useMemo(() => {
        return `<iframe src="${window.location.origin}/embed/${context.score.id}?simplified=${simplified}&position=${position}" width="${width}" height="${height}" title="${context.score.name}"></iframe>`;
    }, [width, height, simplified, position, context.score]);

    useEffect(() => {
        const height = calculateEmbeddingHeight(context.score);
        setHeight(`${height}`);
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
                    <Input.Wrapper
                        size={"xl"}
                        label={t("dialog.embedScore.width")}
                    >
                        <TextInput
                            leftSection={<TbArrowAutofitWidth size={Size.icon.MD}/>}
                            size={"xl"}
                            placeholder={t("view.editor.form.name")}
                            value={width}
                            onChange={e => setWidth(e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                </Grid.Col>
                <Grid.Col span={{xs: 12, sm: 6}}>

                    <Input.Wrapper
                        size={"xl"}
                        label={t("dialog.embedScore.height")}
                    >
                        <TextInput
                            leftSection={<TbArrowAutofitHeight size={Size.icon.MD}/>}
                            size={"xl"}
                            placeholder={t("view.editor.form.name")}
                            value={height}
                            onChange={e => setHeight(e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                </Grid.Col>
            </Grid>


            <Input.Wrapper
                size={"xl"}
                mt={"lg"}
                label={t("dialog.embedScore.position")}
            >
                <TextInput
                    leftSection={<TbArrowAutofitHeight size={Size.icon.MD}/>}
                    size={"xl"}
                    placeholder={t("dialog.embedScore.position")}
                    value={position}
                    onChange={e => setPosition(e.currentTarget.value)}
                />
            </Input.Wrapper>

            <Group mt={"lg"}>
                <Switch
                    size={"lg"}
                    className={"hover-pointer"}
                    checked={simplified}
                    label={t(`view.scoreDetails.settings.selectSimplifiedMode`)}
                    onChange={() => setSimplified(!simplified)}
                />
            </Group>

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

                <CopyButton value={code}>
                    {({copied, copy}) => (
                        <Button
                            color={copied ? 'teal' : 'red'}
                            size={"md"}
                            leftSection={!copied && <MdOutlineContentCopy size={Size.icon.SM}/>}
                            onClick={copy}>
                            {t(`button.${copied ? "copied" : "copy"}`)}
                        </Button>
                    )}
                </CopyButton>
            </Group>
        </Dialog>
    )
};

export default EmbedScoreDialog;
