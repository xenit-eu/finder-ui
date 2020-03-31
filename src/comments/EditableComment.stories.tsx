import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import * as React from "react";
import EditableComment from "./EditableComment";

export default {
    title: "comments/EditableComment",
    component: EditableComment,
};

export const normal = () => <EditableComment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Once a police officer caught Chuck Norris, the cop was lucky enough to escape with a warning.",
    }}
    isSaving={boolean("isSaving", false)}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;

export const multiLine = () => <EditableComment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Once a police officer caught Chuck Norris.\nThe cop was lucky enough to escape with a warning.",
    }}
    isSaving={boolean("isSaving", false)}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;
