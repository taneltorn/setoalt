import React, {useState} from "react";
import {ActionIcon, Group, Loader, Menu, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../hooks/useScoreContext.tsx";
import {BsCodeSlash, BsFiletypePng} from "react-icons/bs";
import {Size} from "../../../utils/constants.ts";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {FaItunesNote} from "react-icons/fa";
import {DialogType} from "../../../utils/enums.ts";
import Help from "../../../components/Help.tsx";

export enum Setting {
    CHANGE_MODE,
    EXPORT_PNG,
    EMBED_CODE
}

interface Properties {
    settings: Setting[];
}

const ScoreSettings: React.FC<Properties> = ({settings}) => {

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
        <Group gap={4}>
            <Help tab={location.pathname.includes("edit") ? "editor" : "playback"}/>
            <Menu shadow={"md"} position={"bottom-start"}>
                <Menu.Target>
                    <ActionIcon
                        size={"xl"}
                        variant={"subtle"}
                        color={"gray"}
                        data-active={"true"}
                        title={t("button.settings")}
                    >
                        {isLoading
                            ? <Loader size={Size.icon.MD}/>
                            : <IoSettingsOutline size={Size.icon.MD}/>}
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {settings.includes(Setting.CHANGE_MODE) &&
                        <Menu.Item onClick={() => context.setIsSimplifiedMode(!context.isSimplifiedMode)}>
                            <Group>
                                <FaItunesNote size={Size.icon.MD}/>
                                <Text
                                    mr={"md"}>{t(`view.scoreDetails.settings.${context.isSimplifiedMode ? "selectDetailMode" : "selectSimplifiedMode"}`)}</Text>
                            </Group>
                        </Menu.Item>}

                    {settings.includes(Setting.EMBED_CODE) &&
                        <Menu.Item onClick={() => open(DialogType.EMBED_SCORE)}>
                            <Group>
                                <BsCodeSlash size={Size.icon.MD}/>
                                <Text mr={"md"}>{t("view.scoreDetails.settings.embedScore")}</Text>
                            </Group>
                        </Menu.Item>}

                    {settings.includes(Setting.EXPORT_PNG) &&
                        <Menu.Item onClick={exportToPng}>
                            <Group>
                                <BsFiletypePng size={Size.icon.MD}/>
                                <Text mr={"md"}>{t("view.scoreDetails.settings.exportPng")}</Text>
                            </Group>
                        </Menu.Item>}
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
};

export default ScoreSettings;
