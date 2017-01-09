
import { DOM as _, createElement as __, ReactElement, Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Badge from 'material-ui/Badge';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export type DocumentTreeNode_t = {
    open: boolean,
    Toggle: () => void,
    text: string,
    children: DocumentTreeNode_t[]
}

export function DocumentTreeNode({open, Toggle, text, children}: DocumentTreeNode_t, indexFromParent: number): ReactElement<any> {
    return __(ListItem, { initiallyOpen: open, primaryTogglesNestedList: (children && children.length > 0), primaryText: text, key: indexFromParent, nestedItems: children.map((v, i) => DocumentTreeNode(v, i)) });
}
export function DocumentTree(node: DocumentTreeNode_t) {
    return __(List, {}, [DocumentTreeNode(node, 0)]);
}