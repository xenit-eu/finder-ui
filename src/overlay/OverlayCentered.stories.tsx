import * as React from "react";
import { Paper, Grid, IconButton } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, number, boolean } from "@storybook/addon-knobs";
import OverlayCentered from "./OverlayCentered";

export default {
    title: "overlay/OverlayCentered",
    decorators: [withKnobs],
    component: OverlayCentered,
};

export const normal = () => <Paper style={{ height: 200 }}>
    <OverlayCentered>
        <span>
            Inline content...
        </span>
    </OverlayCentered>
</Paper>;
