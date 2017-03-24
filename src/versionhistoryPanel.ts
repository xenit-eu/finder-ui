import { createElement as __, Component, DOM as _, ReactElement } from 'react';
import * as moment from "moment";
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
import SocialPerson from 'material-ui/svg-icons/social/person'
import Input from 'material-ui/svg-icons/action/input'
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {Node, NodeRef,NodeMetadataProperty } from 'finder-repository'
import { IPromise } from 'apixjs'
export type Version = {
    title:string
    editor: string,
    editDate: string,
    editComment: string,
    versionNumber: string,
    nodeRef: NodeRef
}
let actionalarm = __(Avatar, { icon: __(ActionAlarm, {}) });
let person = __(Avatar, { icon: __(SocialPerson, {}) });
let input = __(Avatar, { icon: __(Input) })
let actionassignment = __(Avatar, { icon: __(ActionAssignment, {}) })

export function BuildVersionPanel(node: NodeRef | undefined, getVersionHistory: (node: NodeRef) => IPromise<{ versions: Version[] }>, when: (v: any) => IPromise<any>) {
    if (!node)
        return when("No document selected.");
    return getVersionHistory(node).then(v => {
        if (!v)
            return "Document has no version history.";
        const versions = v.versions;
        const singleV = (v: Version) => {
            let childsToDisplay = [
                __(ListItem, {}, _.h3({}, v.title)),
                __(ListItem, { leftAvatar: person }, "" + v.editor),
                __(ListItem, { leftAvatar: actionalarm }, (moment(new Date(Number.parseInt(v.editDate))).fromNow())),
                __(ListItem, { leftAvatar: input }, "" + v.nodeRef.ToApixV1NodeRef())
            ];
            childsToDisplay = childsToDisplay.concat(v.editComment ? __(ListItem, { leftAvatar: actionassignment }, ["" + v.editComment]) : []);
            return __(ListItem, { nestedItems: childsToDisplay }, v.versionNumber)
        };
        const elements = versions.map(v => singleV(v));
        const lst = __(List, {}, elements);
        return _.div({}, lst);
    });
}