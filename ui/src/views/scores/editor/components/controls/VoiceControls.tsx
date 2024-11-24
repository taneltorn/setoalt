import React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Button, Group} from "@mantine/core";
import VoiceFilterButton from "../../../../../components/controls/VoiceFilterButton.tsx";
import {MdRecordVoiceOver} from "react-icons/md";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {FaEdit, FaPlus} from "react-icons/fa";
import {DefaultVoices} from "../../../../../utils/dictionaries.ts";
import {FaRegTrashCan} from "react-icons/fa6";
import {Voice} from "../../../../../model/Voice.ts";
import {Size} from "../../../../../utils/constants.ts";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {DialogType} from "../../../../../utils/enums.ts";
import {sortVoicesByOrder} from "../../../../../utils/helpers.tsx";

const VoiceControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const history = useHistory();
    const {open, close} = useDialogContext();

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        history.snapshot(context);

        const reorderedVoices = Array.from(context.score.data.voices);
        const [removed] = reorderedVoices.splice(result.source.index, 1);
        reorderedVoices.splice(result.destination.index, 0, removed);

        reorderedVoices.forEach((voice, index) => {
            voice.order = index;
        });

        context.setScore({
            ...context.score,
            data: {
                ...context.score.data,
                voices: reorderedVoices,
            },
        });

        context.refresh();
    };


    const handleVoiceSave = (voice: Voice) => {
        context.setActiveVoice(voice.name);
        close();
    };

    const handleVoiceRemove = (name: string) => {
        history.snapshot(context);

        context.score.data.voices = context.score.data.voices.filter(v => v.name !== name);

        if (context.score.data.voices[0]) {
            context.setActiveVoice(context.score.data.voices[0].name);
        }
        context.refresh();
        close();
    };

    const handleVoiceClick = (event: any, name: string) => {
        if (event.ctrlKey) {
            const voice = context.score.data.voices.find(v => v.name === name);
            if (voice && voice.name !== context.activeVoice) {
                voice.hidden = !voice.hidden;
                context.refresh();
            }
            return;
        }
        context.setActiveVoice(name);
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== name;
        });
        context.refresh();
    }

    return (
        <Group justify={"space-between"} my={"md"}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Group justify={"space-between"} my={"md"}>
                    <Droppable droppableId="voices" direction="horizontal">
                        {(provided) => (
                            <Group
                                gap={4}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {sortVoicesByOrder(context.score.data.voices).map((voice, index) => (
                                    <Draggable
                                        key={voice.name}
                                        draggableId={voice.name}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <VoiceFilterButton
                                                    active={voice.name === context.activeVoice}
                                                    halfActive={!voice.hidden}
                                                    label={voice.name}
                                                    onClick={(e) => handleVoiceClick(e, voice.name)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Group>
                        )}
                    </Droppable>

                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<FaPlus/>}
                        variant={"subtle"}
                        onClick={() =>
                            open(DialogType.SAVE_VOICE, {
                                onConfirm: handleVoiceSave,
                            })
                        }
                    >
                        {t("button.addNew")}
                    </Button>
                </Group>
                <Group gap={4}>
                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<MdRecordVoiceOver size={Size.icon.XS}/>}
                        variant={"subtle"}
                        onClick={() =>
                            context.score.data.voices.some((v) => v.hidden)
                                ? context.score.data.voices.forEach((v) => (v.hidden = false))
                                : context.score.data.voices.forEach(
                                    (v) => (v.hidden = v.name !== context.activeVoice)
                                )
                        }
                    >
                        {t(
                            context.score.data.voices.some((v) => v.hidden)
                                ? "button.showAll"
                                : "button.showActive"
                        )}
                    </Button>

                    {!DefaultVoices.map((v) => v.name).includes(context.activeVoice) && (
                        <>
                            <Button
                                size={"xs"}
                                color={"blue"}
                                leftSection={<FaEdit size={Size.icon.XS}/>}
                                variant={"subtle"}
                                onClick={() =>
                                    open(DialogType.SAVE_VOICE, {
                                        voice: context.score.data.voices.find(
                                            (v) => v.name === context.activeVoice
                                        ),
                                        onConfirm: handleVoiceSave,
                                    })
                                }
                            >
                                {t("button.changeVoice")}
                            </Button>
                            <Button
                                size={"xs"}
                                color={"red"}
                                leftSection={<FaRegTrashCan size={Size.icon.XS}/>}
                                variant={"subtle"}
                                onClick={() => handleVoiceRemove(context.activeVoice)}
                            >
                                {t("button.removeVoice")}
                            </Button>
                        </>
                    )}
                </Group>
            </DragDropContext>
        </Group>
    );
};

export default VoiceControls;
