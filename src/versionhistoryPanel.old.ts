import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";
import ActionAlarm from "material-ui/svg-icons/action/alarm";
import ActionAssignment from "material-ui/svg-icons/action/assignment";
import ChangeHistory from "material-ui/svg-icons/action/change-history";
import Input from "material-ui/svg-icons/action/input";
import Subtitles from "material-ui/svg-icons/av/subtitles";
import SocialPerson from "material-ui/svg-icons/social/person";

import * as moment from "moment";
import { Component, createElement as __, CSSProperties, ReactElement } from "react";
import * as _ from "react-dom-factories";
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
};
const iconsize = 30;
const changeHistory = __(Avatar, { size: iconsize, icon: __(ChangeHistory, {}) });
const actionalarm = __(Avatar, { size: iconsize, icon: __(ActionAlarm, {}) });
const person = __(Avatar, { size: iconsize, icon: __(SocialPerson, {}) });
const input = __(Avatar, { size: iconsize, icon: __(Input) });
const actionassignment = __(Avatar, { size: iconsize, icon: __(ActionAssignment, {}) });
const subtitles = __(Avatar, { size: iconsize, icon: __(Subtitles) });
export function VersionsHistoryPanel({ show, versions }: VersionsHistoryPanel_t): ReactElement<any> {
    if (show) {
        if (versions.length === 0) {
            return _.div({ className: "docversions" }, "Document has no version history.");
        }
        const textcenteredstyle: { style: CSSProperties } = { style: { display: "inline-block", position: "relative", top: "-4px", left: "8px", width: "125px" } };
        const outerspanStyle: { style: CSSProperties } = { style: { display: "inline-block", marginTop: "3px", marginBottom: "3px", marginLeft: "8px", marginRight: "8px", width: "165px" } };
        const singleVersion = (v: Version_t) => {
            const momentText = moment(new Date(Number.parseInt(v.editDate))).fromNow();
            const noderefSpan = Object.assign({ title: v.nodeRef }, outerspanStyle);
            let childsToDisplay: any[] = [
                // __(ListItem, { leftAvatar: person }, "" + v.editor),
                // __(ListItem, { leftAvatar: actionalarm }, (moment(new Date(Number.parseInt(v.editDate))).fromNow())),
                // __(ListItem, { leftAvatar: input }, "" + v.nodeRef),
                _.span(outerspanStyle, [person, _.span(textcenteredstyle, "" + v.editor)]),
                _.span(outerspanStyle, [actionalarm, _.span(textcenteredstyle, "" + momentText)]),
                _.span(noderefSpan, input),
            ];
            childsToDisplay = ((v.title && v.title.trim().length > 0) ? [_.span(outerspanStyle, [subtitles, _.span(textcenteredstyle, v.title)])] : []).concat(childsToDisplay);
            childsToDisplay = childsToDisplay.concat(v.editComment ?
                [_.span(outerspanStyle, [actionassignment, _.span(textcenteredstyle, "" + v.editComment)])] : []);
            childsToDisplay = [_.span(outerspanStyle, [changeHistory, _.span(textcenteredstyle, v.versionNumber)])].concat(childsToDisplay);

            //return __(ListItem, { nestedItems: childsToDisplay }, v.versionNumber);
            return childsToDisplay;
        };
        const elements = versions.map(a => __(Paper, { style: { margin: "3px", padding: "3px" }, zDepth: 1, children: singleVersion(a) }));
        return _.div({ className: "docversions" }, __(List, {}, elements));
    } else {
        return _.div({});
    }
}
