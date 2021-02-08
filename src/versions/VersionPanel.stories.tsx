import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import React from "react";
import VersionPanel, { IVersionPanelVersion } from "./VersionPanel";

export default {
    title: "versions/VersionPanel",
    component: VersionPanel,
};

const versions: IVersionPanelVersion[] = [
    {
        author: "A. Lovelace",
        comment: "Revision after meeting",
        title: "file.doc",
        versionNumber: "2.0",
        versionDate: new Date("2020-04-05T00:00:00.000Z"),
    },
    {
        author: "C. Norris",
        comment: "Upload editable version",
        title: "file.doc",
        versionNumber: "1.1",
        versionDate: new Date("2020-04-02T00:00:00.000Z"),

    },
    {
        author: "C. Norris",
        comment: "Initial version",
        title: "file.pdf",
        versionNumber: "1.0",
        versionDate: new Date("2020-04-01T00:00:00.000Z"),
    },

];

function VersionPanelInteractive() {
    const [selectedVersion, setSelectedVersion] = React.useState<IVersionPanelVersion>();
    return <VersionPanel
        versions={versions}
        selectedVersion={selectedVersion}
        onVersionClick={setSelectedVersion}
        onDetails={setSelectedVersion}
    />;

}

export const interactive = () => <VersionPanelInteractive />;

interactive.parameters = {
    storyshots: { disable: true },
};

export const withoutActions = () => <VersionPanel
    versions={versions}
/>;

export const withReadonlyActions = () => <VersionPanel
    versions={versions}
    onDownload={action("download")}
    onDetails={action("details")}
    onVersionClick={action("versionClick")}
/>;

export const withAllActions = () => <VersionPanel
    versions={versions}
    onVersionClick={action("versionClick")}
    onDownload={action("download")}
    onDetails={action("details")}
    onRevert={action("revert")}
/>;

export const withSelectedVersion = () => <VersionPanel
    versions={versions}
    selectedVersion={versions[1]}
    onVersionClick={action("versionClick")}
    onDownload={action("download")}
    onDetails={action("details")}
    onRevert={action("revert")}
/>;

export const empty = () => <VersionPanel versions={[]} />;

export const withCreateButton = () => <VersionPanel
    versions={versions}
    onCreateVersion={action("versionCreate")}
/>;
