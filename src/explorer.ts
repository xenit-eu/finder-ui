import { BuildDocumentTreeNodeForNode, DocumentTreeNode_t, FinderAssociationRepository, FinderNodeRepository } from "finder-services";
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

export function BuildTreeNodeRoot(node: DocumentTreeNode_t) {
    return __(List, {}, [TreeNode(node)]);
}

export function BuildDocumentTree(
    nodeId: string | undefined,
    AssociationRepository: FinderAssociationRepository,
    IsToggledOpen: (id: string) => boolean,
    nodeRepository: FinderNodeRepository,
    loadNode: DocumentTreeNode_t | undefined,
    clickNode: (id: string) => void,
    toggleNode: (id: string) => void,
    IsSelected: (id: string) => boolean) {
    return BuildDocumentTreeNodeForNode(nodeId, AssociationRepository, IsToggledOpen, nodeRepository, loadNode, clickNode, toggleNode, IsSelected)
        .then(viewModel => BuildTreeNodeRoot(viewModel));
}
