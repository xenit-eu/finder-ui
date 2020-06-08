import { action } from "@storybook/addon-actions";
import React from "react";
import CreateVersionDialog from "./CreateVersionDialog";
import { VersionPanelCreateVersionType } from "./types";

export default {
    title: "versions/CreateVersion/CreateVersionDialog",
    component: CreateVersionDialog,
};

export const empty = () => <CreateVersionDialog
    currentVersion="2.4"
    state={{}}
    onChange={action("change")}
/>;

export const withData = () => <CreateVersionDialog
    currentVersion="2.4"
    state={{
        type: VersionPanelCreateVersionType.MAJOR,
        file: {
            name: "Some file name",
        } as any,
        comment: "Some extensive comments\nOn multiple lines",
    }}
    onChange={action("change")}
/>;
