import React from 'react';
import {ActionIcon, Button, Center, Divider, Group, Select, Table} from "@mantine/core";
import {Color, Layout, Size} from "../../../../utils/constants.ts";
import IconButton from "../../../../components/controls/IconButton.tsx";
import {FaRegTrashCan} from "react-icons/fa6";
import {useTranslation} from "react-i18next";
import {Stave} from "../../../../model/Stave.ts";
import StavePreview from "../../details/components/stave/StavePreview.tsx";
import {range} from "../../../../utils/helpers.tsx";
import {NoteRange} from "../../../../utils/dictionaries.ts";
import {useAudioContext} from "../../../../hooks/useAudioContext.tsx";
import {BiPlus} from "react-icons/bi";
import {RiArrowGoBackFill} from "react-icons/ri";
import {FaPlayCircle} from "react-icons/fa";

const NOTE_RANGE = NoteRange.reverse();

interface Properties {
    stave: Stave;
    setStave: (stave: Stave) => void;
    onConfirm: (stave: Stave) => void;
    onClose: () => void;
}

const StaveCreator: React.FC<Properties> = ({stave, setStave, onConfirm, onClose}) => {

    const {t} = useTranslation();

    const audioContext = useAudioContext();

    const handleLineAdd = () => {
        const y = stave.lines.length > 0 ? Math.max(...stave.lines.map(l => l.y)) + 2 : 0;
        const line = {
            pitch: "",
            y: y,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        }
        setStave({...stave, lines: [...stave.lines, line]});
    }

    const handleLineYChange = (index: number, value: string | null) => {
        stave.lines[index].y = Number(value);
        setStave({...stave});
    }

    const handleLinePitchChange = (index: number, value: string | null) => {
        stave.lines[index].pitch = value || "";
        setStave({...stave});
    }

    const handleLineColorChange = (index: number, value: string | null) => {
        stave.lines[index].color = value || "#000";
        setStave({...stave});
    }


    const handleLineRemove = (index: number) => {
        setStave({...stave, lines: stave.lines.filter((_, i) => i !== index)});
    }

    const handlePlay = () => {
        audioContext.playStaveScale(stave);
    }

    return (
        <>
            <Group gap={4}>
                <Button px={"sm"} variant={"transparent"} onClick={handlePlay} disabled={stave.lines.length === 0}>
                    <Group gap={"xs"}>
                        <ActionIcon
                            size={Size.icon.SM}
                            title={t("button.listen")}
                            c={"white"}
                        >
                            {<FaPlayCircle size={Size.icon.XL}/>}
                        </ActionIcon>
                        {t("button.listen")}
                    </Group>
                </Button>
            </Group>

            {stave.lines.length > 0 && <>
                <StavePreview stave={stave} width={300}/>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td>{t("view.editor.form.pitch")}</Table.Td>
                            <Table.Td>{t("view.editor.form.distance")}</Table.Td>
                            <Table.Td>{t("view.editor.form.color")}</Table.Td>
                            <Table.Td/>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {stave.lines.map((_, index) => (
                            <Table.Tr key={`line-${index}`}>
                                <Table.Td>
                                    <Select
                                        value={stave.lines[index].pitch}
                                        data={NOTE_RANGE.reverse()}
                                        onChange={v => handleLinePitchChange(index, v)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <Select
                                        value={`${stave.lines[index].y}`}
                                        data={range(0, 20).map(n => `${n}`)}
                                        onChange={v => handleLineYChange(index, v)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <Select
                                        value={stave.lines[index].color}
                                        data={[
                                            {value: "#000", label: t("line.dark")},
                                            {value: "#eee", label: t("line.light")},
                                            {value: "#fff", label: t("line.transparent")},
                                        ]}
                                        onChange={v => handleLineColorChange(index, v)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <IconButton
                                        title={t("button.remove")}
                                        icon={<FaRegTrashCan size={Size.icon.XS}/>}
                                        onClick={() => handleLineRemove(index)}
                                    />
                                </Table.Td>
                            </Table.Tr>))}
                    </Table.Tbody>
                </Table>
            </>}

            <Center>
                <Button
                    size={"sm"}
                    variant={"subtle"}
                    leftSection={<BiPlus size={Size.icon.SM}/>}
                    onClick={handleLineAdd}
                >
                    {t("button.addLine")}
                </Button>
            </Center>

            <Divider my={"xl"}/>

            <Group justify={"end"} gap={4}>
                <Button
                    variant={"subtle"}
                    onClick={onClose}>
                    <Group>
                        <RiArrowGoBackFill size={Size.icon.SM}/>
                        {t("button.back")}
                    </Group>

                </Button>
                <Button
                    disabled={!!stave.lines.find(l => l.pitch === "")}
                    onClick={() => onConfirm(stave)}>
                    {t("button.confirm")}
                </Button>

            </Group>

        </>
    )
};

export default StaveCreator;
