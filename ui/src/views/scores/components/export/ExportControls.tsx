import React, {useState} from "react";
import {ActionIcon, Group, Loader} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {BsCodeSlash, BsFiletypePng} from "react-icons/bs";
import {Size} from "../../../../utils/constants.ts";
import {DialogType, useDialogContext} from "../../../../context/DialogContext.tsx";

interface Properties {
    hideEmbeddingExport?: boolean;
    hidePNGExport?: boolean;
}

const ExportControls: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const exportToPng = () => {
        setIsLoading(true);
        context.setIsExportMode(true);

        setTimeout(() => {
            downloadPng()
                .finally(() => {
                    context.setIsExportMode(false);
                    setIsLoading(false);
                })
        }, 1000);
    }

    const downloadPng = async () => {
        const svg = context.svgRef?.current;
        if (!svg) {
            return;
        }

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        source = source.replace(/(<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg")/, '$1 xmlns:xlink="http://www.w3.org/1999/xlink"');
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF'; // white
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0);
                const canvasUrl = canvas.toDataURL("image/png");

                const link = document.createElement('a');
                link.download = 'image.png';
                link.href = canvasUrl;
                link.click();
            }
        };
    }

    return (
        <Group gap={"xs"}>
            {!props.hideEmbeddingExport &&
                <ActionIcon
                    size={"xl"}
                    variant={"subtle"}
                    color={"black"}
                    onClick={() => open(DialogType.EMBED_SCORE)}
                >
                    <BsCodeSlash size={Size.icon.MD}/>
                </ActionIcon>}

            {!props.hidePNGExport &&
                <ActionIcon
                    title={t(`tooltip.exportToPng`)}
                    variant={"subtle"}
                    size={"xl"}
                    color={"black"}
                    onClick={exportToPng}
                    disabled={isLoading}
                >
                    {isLoading
                        ? <Loader size={Size.icon.MD}/>
                        : <BsFiletypePng size={Size.icon.MD}/>}
                </ActionIcon>}
        </Group>

    );
};

export default ExportControls;
