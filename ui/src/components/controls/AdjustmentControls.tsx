import React from 'react';
import {Button, Group} from "@mantine/core";
import {Size} from "../../utils/constants.ts";
import {HiMinus, HiPlus} from "react-icons/hi";

interface Properties {
    increaseDisabled?: boolean;
    decreaseDisabled?: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
}

const AdjustmentControls: React.FC<Properties> = (props) => {

    return (
        <Group mt={"md"} gap={4}>
            <Button
                size={"compact-md"}
                disabled={props.decreaseDisabled}
                onClick={props.onDecrease}
            >
                <HiMinus size={Size.icon.XS}/>
            </Button>
            <Button
                size={"compact-md"}
                disabled={props.increaseDisabled}
                onClick={props.onIncrease}
            >
                <HiPlus size={Size.icon.XS}/>
            </Button>
        </Group>
    )
};

export default AdjustmentControls;
