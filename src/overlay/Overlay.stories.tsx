import { Grid, IconButton, Paper } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import { boolean, number, text } from "@storybook/addon-knobs";
import * as React from "react";
import Overlay from "./Overlay";

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
