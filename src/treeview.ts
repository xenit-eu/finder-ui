
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
    text: string,
    children: DocumentTreeNode_t[],
    isFolder: boolean
}

export function DocumentTreeNode({open, Toggle, text, children, isFolder, id}: DocumentTreeNode_t): ReactElement<any> {
    let avatar = __(Avatar, { icon: __(isFolder ? FileFolder : ActionAssignment, {}) });
    console.log("Building a fireloaded toggle: "+id);
    return __(ListItem, { 
        onNestedListToggle: () => {console.log("Firing a toggle with id: "+id);Toggle(id);},
        initiallyOpen: open, 
        leftAvatar: avatar, 
        primaryTogglesNestedList: (children && children.length > 0), 
        primaryText: text, 
        key: id, 
        nestedItems: children.map((v, i) => DocumentTreeNode(v)) });
}

export function DocumentTree(node: DocumentTreeNode_t) {
    return __(List, {}, [DocumentTreeNode(node)]);
}