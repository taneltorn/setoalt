import React from 'react';
import {Skeleton} from '@mantine/core';
import {Layout} from "../../utils/constants.ts";

const StaveSkeleton: React.FC = () => {

    return (
        <>
            <Skeleton height={4} mt={50}/>
            <Skeleton height={4} mt={Layout.stave.line.SPACING * 4}/>
            <Skeleton height={4} mt={Layout.stave.line.SPACING * 4}/>
        </>
    )
};

export default StaveSkeleton;
