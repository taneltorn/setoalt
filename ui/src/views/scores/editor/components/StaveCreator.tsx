import React from 'react';
import {Box, Button, Center, Select, Table} from "@mantine/core";
import {Color, Layout, Size} from "../../../../utils/constants.ts";
import IconButton from "../../../../components/controls/IconButton.tsx";
import {FaRegTrashCan} from "react-icons/fa6";
import {useTranslation} from "react-i18next";
import {Stave} from "../../../../model/Stave.ts";
import {range} from "../../../../utils/helpers.tsx";
import {NoteRange} from "../../../../utils/dictionaries.ts";
import {BiPlus} from "react-icons/bi";

const NOTE_RANGE = NoteRange.reverse();

interface Properties {
    stave: Stave;
    setStave: (stave: Stave) => void;
    linesWithError: number[];
}

const StaveCreator: React.FC<Properties> = ({stave, setStave, linesWithError}) => {

    const {t} = useTranslation();

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

    return (
        <Box mt={"xl"}>
            {stave.lines.length > 0 && <>
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
                                        className={linesWithError.includes(index) ? "input-error" : ""}
                                        value={stave.lines[index].pitch}
                                        data={NOTE_RANGE}
                                        onChange={v => handleLinePitchChange(index, v)}
                                    />

                                </Table.Td>
                                <Table.Td>
                                    <Select
                                        value={`${stave.lines[index].y}`}
                                        data={range(0, 30).map(n => `${n}`)}
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
                    mt={"md"}
                    variant={"subtle"}
                    leftSection={<BiPlus size={Size.icon.SM}/>}
                    onClick={handleLineAdd}
                >
                    {t("button.addLine")}
                </Button>
            </Center>
        </Box>
    )
};

export default StaveCreator;
