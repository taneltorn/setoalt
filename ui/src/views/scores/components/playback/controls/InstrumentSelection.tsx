import React from 'react';
import {useTranslation} from "react-i18next";
import {Button, Group, Menu, Text} from "@mantine/core";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {Instruments} from "../../../../../utils/dictionaries.ts";
import {InstrumentIcons} from "../../../../../utils/icons.tsx";
import {Instrument} from "../../../../../model/Instrument.ts";

const InstrumentSelection: React.FC = () => {

    const {t} = useTranslation();
    const context = useAudioContext();

    const handleChange = (instrument: Instrument) => {
        context.stopPlayback();
        context.setInstrument(instrument);
    }

    return (
        <Menu shadow={"md"} position={"bottom-start"}>
            <Menu.Target>
                <Button
                    px={4}
                    variant={"subtle"}
                    color={"gray"}
                    data-active={"true"}
                    title={t("button.changeInstrument")}
                >
                    {InstrumentIcons.get(context.instrument.name)}
                </Button>
            </Menu.Target>
            <Menu.Dropdown style={{zIndex: 5}}>
                {Instruments.map(instrument =>
                    <Menu.Item key={instrument.name}
                               onClick={() => handleChange(instrument)}>
                        <Group>
                            {InstrumentIcons.get(instrument.name)}
                            <Text size={"xl"}>{t(`instrument.${instrument.name}`)}</Text>
                        </Group>
                    </Menu.Item>)}
            </Menu.Dropdown>
        </Menu>
    );
};

export default InstrumentSelection;