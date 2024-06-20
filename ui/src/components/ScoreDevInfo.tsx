import React from "react";
import {useScoreContext} from "../context/ScoreContext.tsx";
import useCursorCoords from "../hooks/useCursorCoords.tsx";
import {Grid} from "@mantine/core";

const ScoreDevInfo: React.FC = () => {

    const context = useScoreContext();
    const {x, y, cx, cy} = useCursorCoords(context.containerRef, context.dimensions);

    return (
        <div style={{marginTop: 20 , padding: "10px 15px", backgroundColor: "#f9f9f9", borderRadius: "16px"}}>
            <code>
                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Current position</strong></pre>
                        <pre>position: {context.activePosition}, duration: {context.activeDuration}, voice: {context.activeVoice.name}</pre>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Active note</strong></pre>
                        {context.activeNote &&
                            <pre>position: {context.activeNote?.position}, pitch: {context.activeNote?.pitch}, duration: {context.activeNote?.duration}, detune: {context.activeNote?.detune|| 0}</pre>}
                        {!context.activeNote && <pre>-</pre>}

                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Occupied positions</strong></pre>
                        <span style={{wordBreak: "break-word"}}>{JSON.stringify(context.activeVoice.occupiedPositions)}</span>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Cursor</strong></pre>
                        <pre>position: {context.cursorPosition}, coords: {x}/{y}, pixels: {cx}/{cy}, scroll: {context.containerRef?.current?.scrollLeft}</pre>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Notes</strong></pre>
                        <span style={{wordBreak: "break-word"}}>{JSON.stringify(context.score.data.voices.flatMap(v => v.notes).map(n => n.position))}</span>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Breaks</strong></pre>
                        <span style={{wordBreak: "break-word"}}>{JSON.stringify(context.score.data.breaks)}</span>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>
                        <pre><strong>Dimensions</strong></pre>
                        <pre>stave: {context.dimensions.x} x {context.dimensions.y}, container: {context.dimensions.x} x {context.dimensions.containerY}, blocks: {context.dimensions.blocks}</pre>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <pre><strong>Semitones</strong></pre>
                        <pre>{context.transposition}</pre>
                    </Grid.Col>
                </Grid>

                <Grid mt={"md"}>
                    <Grid.Col span={12}>
                        <pre><strong>Data</strong></pre>
                        {JSON.stringify(context.score)}
                    </Grid.Col>
                </Grid>
            </code>
        </div>
    );
}

export default ScoreDevInfo;
