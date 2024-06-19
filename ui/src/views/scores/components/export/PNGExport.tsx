import React, {useState} from "react";
import {Button, Loader} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {RiDownloadCloudFill} from "react-icons/ri";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";

const PNGExport: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
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
        <Button
            title={t(`tooltip.exportToPng`)}
            variant={"subtle"}
            size={"md"}
            color={"black"}
            onClick={exportToPng}
            disabled={isLoading}
            leftSection={isLoading
                ? <Loader size={20}/>
                : <RiDownloadCloudFill size={24}/>}
        >
            {t("button.pngExport")}
        </Button>
    );
};

export default PNGExport;
