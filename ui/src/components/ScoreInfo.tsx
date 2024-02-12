import React from "react";
import {useScoreContext} from "../context/ScoreContext.tsx";
import useCursorCoords from "../hooks/useCursorCoords.tsx";
import {Grid} from "@mantine/core";

const ScoreInfo: React.FC = () => {

    const context = useScoreContext();
    const {x, y, cx, cy} = useCursorCoords(context.containerRef);

    return (
        <div style={{padding: "10px 15px", backgroundColor: "#f9f9f9    ", borderRadius: "16px"}}>
            <code>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Current position</strong></pre>
                        <pre>position: {context.currentPosition}, duration: {context.currentDuration}, voice: {context.currentVoice.name}</pre>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <pre><strong>Cursor</strong></pre>
                        <pre>position: {context.cursorPosition}, coords: {x}/{y}, pixels: {cx}/{cy}</pre>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Current note</strong></pre>
                        {context.currentNote &&
                            <pre>position: {context.currentNote?.position}, pitch: {context.currentNote?.pitch}, duration: {context.currentNote?.duration}, detune: {context.currentNote?.detune|| 0}</pre>}
                        {!context.currentNote && <pre>-</pre>}

                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Stave</strong></pre>
                        <pre>name: {context.score.data.stave.name}, dimensions: {context.dimensions.x} x {context.dimensions.y}</pre>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Notes</strong></pre>
                        <pre>{JSON.stringify(context.score.data.voices.flatMap(v => v.notes).map(n => n.position))}</pre>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Breaks</strong></pre>
                        <pre>{JSON.stringify(context.score.data.breaks)}</pre>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={12}>
                        <pre><strong>Data</strong></pre>
                        {JSON.stringify(context.score)}
                    </Grid.Col>
                </Grid>
            </code>
        </div>
    );
}

export default ScoreInfo;