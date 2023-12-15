import React from 'react';
// import {useScoreContext} from "../../context/ScoreContext";
// import {useTranslation} from "react-i18next";
// import {useHistoryContext} from "../../context/HistoryContext";

const HistoryPanel: React.FC = () => {

    // const [t] = useTranslation();
    // const scoreContext = useScoreContext();
    // const historyContext = useHistoryContext();

    return (<>
            {/*<Panel label={t("editor.label.redactor")}>*/}

            {/*    <PanelButton*/}
            {/*        className={"me-1"}*/}
            {/*        active={false}*/}
            {/*        // disabled={!(scoreContext.history.length > 0)}*/}
            {/*        label={<IoIosUndo/>}*/}
            {/*        onClick={() => historyContext.undo(scoreContext)}*/}
            {/*    />*/}
            {/*</Panel>*/}
        </>
    )
};

export default HistoryPanel;
