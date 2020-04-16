import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import React from "react";
import Version from "./Version";

export default {
    title: "versions/Version",
    component: Version,
};

export const normal = () => <Version version={{
    title: "some_document.pdf",
    versionNumber: "1.2",
    versionDate: new Date("2020-04-01T00:00:00.000Z"),
    author: "C. Norris",
    comment: "Add timing section",
}}
    latest={boolean("latest", false)}
    onDownload={action("download")}
    onDetails={action("details")}
    onClick={action("click")}
/>;

export const withRevert = () => <Version version={{
    title: "some_document.pdf",
    versionNumber: "1.2",
    versionDate: new Date("2020-04-01T00:00:00.000Z"),
    author: "C. Norris",
    comment: "Add timing section",
}}
    latest={boolean("latest", false)}
    onDownload={action("download")}
    onDetails={action("details")}
    onRevert={action("revert")}
    onClick={action("click")}
/>;

export const latest = () => <Version version={{
    title: "some_document.pdf",
    versionNumber: "1.2",
    versionDate: new Date("2020-04-01T00:00:00.000Z"),
    author: "C. Norris",
    comment: "Add timing section",
}}
    latest
/>;

export const selected = () => <Version version={{
    title: "some_document.pdf",
    versionNumber: "1.2",
    versionDate: new Date("2020-04-01T00:00:00.000Z"),
    author: "C. Norris",
    comment: "Add timing section",
}}
    selected

    onClick={action("click")}
/>;
