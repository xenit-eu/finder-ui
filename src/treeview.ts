
import { DOM as _, createElement as __, ReactElement } from 'react';
import { List, ListItem } from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Badge from 'material-ui/Badge';

export type OnFacetSelected = (name: string, label: string, value: string) => void;

export type TreeviewElement = {
    label: string,
    //open: boolean,
    children?: TreeviewElement[]
};
export type Treeview_t = TreeviewElement
export function TreeviewElement(treeviewElement: TreeviewElement): ReactElement<any> {
    let children = treeviewElement.children ? treeviewElement.children.map(c => TreeviewElement(c)) : [];
    return _.div({ className: "TreeviewElement" }, [<ReactElement<any>>_.text({}, treeviewElement.label)].concat(children))
}

