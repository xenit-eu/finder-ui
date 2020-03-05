import moment from "moment";
import { createElement as __, CSSProperties, ReactElement } from "react";
import * as _ from "react-dom-factories";

import "./versionhistoryPanel.less";

export const DOCUMENT_NO_VERSION_HISTORY = "Document has no version history.";

export type Version_t = {
    title: string
    editor: string,
    editDate: string,
    editComment: string,
    versionNumber: string,
    nodeRef: string,
};

export type VersionsHistoryPanel_t = {
    show: boolean,
    versions: Version_t[],
    translate?: (s: string) => string,
};

const avatarStyle: CSSProperties = {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(188, 188, 188)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    borderRadius: "50%",
    height: "30px",
    width: "30px",
};

const avatarSvgStyle: CSSProperties = {
    display: "inline-block",
    color: "rgb(255, 255, 255)",
    fill: "rgb(255, 255, 255)",
    height: "18px",
    width: "18px",
    transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    fontSize: "18px",
    margin: "6px",
};
const avatar = _.div({ style: avatarStyle } as any, [
    _.svg({ key: "svg", viewBox: "0 0 24 24", style: avatarSvgStyle as any }, [
        _.path({ key: "path", d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }),
    ]),
]);
function isNumeric(num: string | number) {
    return !isNaN(+num);
}
function VersionItem({ version: v }: { version: Version_t }) {
    const time = moment(new Date(isNumeric(v.editDate) ? Number.parseInt(v.editDate) : v.editDate));
    return _.div({ className: "history-item" },
        _.div({ key: "history-version-parent" },
            _.div({ key: "history-version", className: "history-version" }, v.versionNumber),
        ),
        _.div({ key: "history-meta-data-parent", className: "history-meta-data" },
            v.title && v.title.length > 0 ? _.div({ className: "history-doc-name" }, v.title) : undefined,
            _.div({ key: "history-details", className: "history-details" },
                _.div({ key: "history-avatar", className: "history-avatar" },
                    avatar,
                ),
                _.div({},
                    _.span({ className: "history-user" }, v.editor),
                    _.span({ className: "history-edited" },
                        _.span({ className: "history-edit-time" }, time.format("L LT")),
                        _.span({ className: "history-edit-reltime" }, time.fromNow()),
                    ),
                    _.span({ className: "history-comment" }, v.editComment),
                ),
            ),
        ),
    );
};
export function VersionsHistoryPanel({ show, versions, translate }: VersionsHistoryPanel_t): ReactElement<any> {
    if (show) {
        if (versions.length === 0) {
            return _.div({ className: "docversions" }, translate ? translate(DOCUMENT_NO_VERSION_HISTORY) : DOCUMENT_NO_VERSION_HISTORY);
        }
        return _.div({ className: "docversions", key: "docversions" }, versions.map((v) => __(VersionItem, { version: v, key: v.versionNumber })));
    } else {
        return _.div({});
    }
}
