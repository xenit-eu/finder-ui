
import { DOM as _, createElement as __, ReactElement, Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Badge from 'material-ui/Badge';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';


export type DocumentTreeNode_t = {
    id: any,
    open: boolean,
    Toggle: (id: any) => void,
    Click: (id: any) => void,
    text: string,
    children: DocumentTreeNode_t[],
    isFolder: boolean
}

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