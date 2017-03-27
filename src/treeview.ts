
import Avatar from "material-ui/Avatar";
import Badge from "material-ui/Badge";
import { List, ListItem } from "material-ui/List";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
import ActionAssignment from "material-ui/svg-icons/action/assignment";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ActionInfo from "material-ui/svg-icons/action/info";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ContentSend from "material-ui/svg-icons/content/send";
import FileFolder from "material-ui/svg-icons/file/folder";
import Toggle from "material-ui/Toggle";
import { Component, createElement as __, DOM as _, ReactElement } from "react";

export type DocumentTreeNode_t = {
    id: any,
    open: boolean,
    Toggle: (id: any) => void,
    Click: (id: any) => void,
    text: string,
    children: DocumentTreeNode_t[],
    isFolder: boolean,
};

export function DocumentTreeNode({open, Toggle, Click, text, children, isFolder, id}: DocumentTreeNode_t): ReactElement<any> {
    let avatar = __(Avatar, { icon: __(isFolder ? FileFolder : ActionAssignment, {}) });
    return __(ListItem, {
        onNestedListToggle: () => { Toggle(id); },
        onClick: (e: any) => {Click(id); e.stopPropagation(); },
        initiallyOpen: open,
        leftAvatar: avatar,
        primaryTogglesNestedList: false,
        primaryText: text,
        key: id,
        nestedItems: children.map((v, i) => DocumentTreeNode(v)),

    });
}

export function DocumentTree(node: DocumentTreeNode_t) {
    return __(List, {}, [DocumentTreeNode(node)]);
}
