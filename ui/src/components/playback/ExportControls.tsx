import React, {useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {Button, Group, Loader} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {FaRegFilePdf} from "react-icons/fa6";
import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

const ExportControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const doc = new jsPDF('l', 'pt', [context.dimensions.x, context.dimensions.containerY]);

    const exportToPdf = () => {
        setIsLoading(true);
        context.setIsExportMode(true);

        setTimeout(() => {
            const element = document.getElementById('notation');
            if (element) {
                doc.svg(element, {
                    width: context.dimensions.x,
                    height: context.dimensions.containerY
                })
                    .then(() => {
                        doc.save(`${context.score?.name
                            .toLowerCase()
                            .replaceAll(" ", "_") || "noodistus"}.pdf`);
                    });
            }

            context.setIsExportMode(false);
            setIsLoading(false);
        }, 3000);
    }

    return (
        <Group gap={4} ml={"xl"}>
            <Button
                title={t(`tooltip.exportToPdf`)}
                variant={"outline"}
                color={"black"}
                onClick={exportToPdf}
                leftSection={isLoading && <Loader size={20}/>}
            >
                <FaRegFilePdf size={24} />
            </Button>
        </Group>
    );
};

export default ExportControls;
