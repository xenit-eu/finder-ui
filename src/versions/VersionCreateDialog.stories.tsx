import { action } from "@storybook/addon-actions";
import React from "react";
import { VersionCreateVersionType } from "./types";
import VersionCreateDialog from "./VersionCreateDialog";

export default {
    title: "versions/VersionCreateDialog",
    component: VersionCreateDialog,
};

export const empty = () => <VersionCreateDialog
    currentVersion="2.4"
    state={{}}
    onChange={action("change")}
/>;

export const withData = () => <VersionCreateDialog
    currentVersion="2.4"
    state={{
        type: VersionCreateVersionType.MAJOR,
        file: {
            name: "Some file name",
        } as any,
        comment: "Some extensive comments\nOn multiple lines",
    }}
    onChange={action("change")}
/>;
