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
    text: string,
    Toggle: (id: string) => void,
    Click: (id: string) => void,
    children: DocumentTreeNode_t[],
    isFolder: boolean,
    className?: string,
};

export function TreeNode({open, Toggle, Click, text, children, isFolder, id, className}: DocumentTreeNode_t): ReactElement<any> {
    let avatar = __(Avatar, { icon: __(isFolder ? FileFolder : ActionAssignment, {}) });
    return __(ListItem, {
        onNestedListToggle: () => { Toggle(id); },
        onClick: (e: any) => { Click(id); e.stopPropagation(); },
        initiallyOpen: open,
        leftAvatar: avatar,
        primaryTogglesNestedList: false,
        primaryText: text,
        key: id,
        nestedItems: children.map((v, i) => TreeNode(v)),
        className: className ? className : "",
    });
}

//@Component BuildTreeNodeRoot
//@ComponentDescription "Displays a folder structure with document in a tree view."
//@Method BuildTreeNodeRoot Returns ReactComponent
//@MethodDescription "BuildTreeNodeRoot({param1: value1, param2: value2, ...})"
//@Param id any "data associated to the current node (typically: document id)"
//@Param open boolean "indicates if this node should be opened"
//@Param text string "text to be displayed for this node"
//@Param children DocumentTreeNode_t[] "child nodes (same structure as the current node)"
//@Param isFolder boolean "indicates that the current node is a document"
//@Param className string "Name of the css class to give to the doclist (optional)"
//@Param Toggle (id: string) => void "called when node is requested to open/close"
//@Param Click (id: string) => void "called when clicking on a node"
export function BuildTreeNodeRoot(node: DocumentTreeNode_t) {
    return __(List, {}, [TreeNode(node)]);
}
