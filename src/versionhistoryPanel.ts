import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import { List, ListItem } from "material-ui/List";
import ActionAlarm from "material-ui/svg-icons/action/alarm";
import ActionAssignment from "material-ui/svg-icons/action/assignment";
import Input from "material-ui/svg-icons/action/input";
import SocialPerson from "material-ui/svg-icons/social/person";
import * as moment from "moment";
import { Component, createElement as __, DOM as _, ReactElement } from "react";

export type Version_t = {
    title: string
    editor: string,
    editDate: string,
    editComment: string,
    versionNumber: string,
    nodeRef: string,
};

export type VersionsHistoryPanel_t = {
    versions: Version_t[],
};

const actionalarm = __(Avatar, { icon: __(ActionAlarm, {}) });
const person = __(Avatar, { icon: __(SocialPerson, {}) });
const input = __(Avatar, { icon: __(Input) });
const actionassignment = __(Avatar, { icon: __(ActionAssignment, {}) });

export function VersionsHistoryPanel ({versions}: VersionsHistoryPanel_t): ReactElement<any> {
    if (versions.length === 0) {
        return _.div({className: "docversions"}, "Document has no version history.");
    }
    const singleVersion = (v: Version_t) => {
        let childsToDisplay = [
            __(ListItem, {}, _.h3({}, v.title)),
            __(ListItem, { leftAvatar: person }, "" + v.editor),
            __(ListItem, { leftAvatar: actionalarm }, (moment(new Date(Number.parseInt(v.editDate))).fromNow())),
            __(ListItem, { leftAvatar: input }, "" + v.nodeRef),
        ];
        childsToDisplay = childsToDisplay.concat(v.editComment ? __(ListItem, { leftAvatar: actionassignment }, ["" + v.editComment]) : []);
        return __(ListItem, { nestedItems: childsToDisplay }, v.versionNumber);
    };
    const elements = versions.map(a => singleVersion(a));
    return _.div({className: "docversions"}, __(List, {}, elements));
}
