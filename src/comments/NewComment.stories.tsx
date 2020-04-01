import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import * as React from "react";
import NewComment from "./NewComment";

export default {
    title: "comments/NewComment",
    component: NewComment,
};

export const initialMode = () => <NewComment
    isEditing={false}
    isSaving={false}
    onCreate={action("create")}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;

export const editMode = () => <NewComment
    isEditing={true}
    isSaving={boolean("isSaving", false)}
    onCreate={action("create")}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;
