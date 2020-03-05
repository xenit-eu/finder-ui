import * as React from "react";
import { Paper, Grid, IconButton } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import { text, number, boolean } from "@storybook/addon-knobs";
import Overlay from "./Overlay"

export default {
    title: "overlay/Overlay",
    component: Overlay,
};

export const normal = () => <Paper>
    <Overlay open={boolean("open", true)} overlay={<div>Overlayed content</div>}>
        <div style={{
            height: 200,
        }}>
            Inline content...
        </div>
    </Overlay>
</Paper>;

export const centered = () => <Paper>
    <Overlay open={boolean("open", true)} overlay={<div>Overlayed content</div>} centered>
        <div style={{
            height: 200,
        }}>
            Inline content...
        </div>
    </Overlay>
</Paper>;
