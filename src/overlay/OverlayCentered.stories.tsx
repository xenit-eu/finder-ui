import { Grid, IconButton, Paper } from "@material-ui/core";
import InsertPhoto from "@material-ui/icons/InsertPhoto";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import OverlayCentered from "./OverlayCentered";

export default {
    title: "overlay/OverlayCentered",
    component: OverlayCentered,
};

export const span = () => <Paper style={{ height: 200 }}>
    <OverlayCentered>
        <span style={{ outline: "1px solid red" }}>
            Inline content...
        </span>
    </OverlayCentered>
</Paper>;

export const div = () => <Paper style={{ height: 200 }}>
    <OverlayCentered>
        <div style={{ outline: "1px solid red" }}>
            Inline content...
        </div>
    </OverlayCentered>
</Paper>;
export const icon = () => <Paper style={{ height: 200 }}>
    <OverlayCentered>
        <InsertPhoto />
    </OverlayCentered>
</Paper>;
