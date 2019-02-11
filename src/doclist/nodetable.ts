import { Checkbox, IconButton, IconMenu, MenuItem } from "material-ui";
import MoreHorizIcon from "material-ui/svg-icons/navigation/more-horiz";
import ToggleIndeterminateCheckBox from "material-ui/svg-icons/toggle/indeterminate-check-box";
import { createElement as __, CSSProperties, MouseEvent } from "react";
import ReactTable, { Column, RowInfo, SortingRule, TableProps } from "react-table";
import "react-table/react-table.css";
import { Node_t, Highlights_t } from "../metadata";
import { ColumnRenderer_t } from "./renderer/interface";

type MenuItem_t<T> = {
    key: T,
    label: string,
    disabled: boolean,
};

export interface INodeTableBasicColumn {
    name: string;
    sortDirection: NodeTableSortDirection;
}
export interface INodeTableColumn extends INodeTableBasicColumn {
    label: string;
    alignRight: boolean;
    sortable: boolean;
    renderer: ColumnRenderer_t;
};

export enum NodeTableSortDirection {
    NONE,
    ASC,
    DESC,
};

export enum NodeTableTranslations {
    PREVIOUS = "finder-ui.nodelist.PREVIOUS",
    NEXT = "finder-ui.nodelist.NEXT",
    LOADING = "finder-ui.nodelist.LOADING",
    NODATA = "finder-ui.nodelist.NODATA",
    PAGE = "finder-ui.nodelist.PAGE",
    OF = "finder-ui.nodelist.OF",
    ROWS = "finder-ui.nodelist.ROWS",
};

type Translations_t = {
    [K in NodeTableTranslations]: string
};

type OnColumnSort_t = (sorts: INodeTableBasicColumn[]) => void;
type OnMenuSelected_t<T> = (node: Node_t, menuKey: T, rowIndex: number, menuIndex: number) => void;

export interface INodeTableRow<T> {
    node: Node_t; // The node to show in this row
    rowMenu: Array<MenuItem_t<T>>; // The menu items to show for this node
    toggled?: boolean; // Whether the node has its checkbox enabled or not (only effective when togglable is true)
    rowStyle: CSSProperties; // Additional CSS properties to apply to the row
    highlights?: Highlights_t[];
};

export interface INodeTableProps<T> {
    rows: INodeTableRow<T>[]; // List of rows to show in the table
    columns: INodeTableColumn[]; // Columns to show in the table
    pager: {
        totalItems: number, // Total number of available items
        pageSize: number, // Paging size
        selectedPage: number, // The index of the selected page (1-based)
    }; // Pagination information
    translations?: Translations_t;
    isLoading?: boolean;
    onPageChanged(pageIndex: number): void; // Called when a request is made to change pages in the result list (1-based)
    onRowSelected(node: Node_t, rowIndex: number): void; // Called when a row is selected
    onToggleAll?: (checked: boolean) => void;
    onRowToggled?: (node: Node_t, checked: boolean, rowIndex: number) => void;
    onRowMenuItemClicked: OnMenuSelected_t<T>; // Called when a row menu item is selected
    onSortChanged: OnColumnSort_t; // Called when a column has to be sorted
};

export function NodeTable<T>(props: INodeTableProps<T>) {
    const firstColumns: Column[] = [
        {
            id: "--norowselect-menu",
            Header: "",
            accessor: (row: INodeTableRow<T>) => row,
            sortable: false,
            resizable: false,
            width: 60,
            Cell: (prop: { value: INodeTableRow<T>, index: number }) => __(RowMenu, {
                menuItems: prop.value.rowMenu,
                onMenuItemSelected: (menuKey: T, menuIndex: number) => {
                    props.onRowMenuItemClicked(prop.value.node, menuKey, prop.index, menuIndex);
                },
            }),
        },
    ];

    if (props.onRowToggled !== undefined) {
        const onToggleAllFallback = (checked: boolean) => props.rows.forEach((row, i) => props.onRowToggled!(row.node, checked, i));
        const onToggleAll = props.onToggleAll || onToggleAllFallback;
        const allRowsToggled = props.rows.every(row => row.toggled || false);
        const noRowsToggled = props.rows.every(row => !row.toggled);
        const indeterminate = !allRowsToggled && !noRowsToggled;
        firstColumns.push({
            id: "--norowselect-toggle",
            Header: (prop: any) => __(Checkbox, {
                checked: !noRowsToggled,
                checkedIcon: indeterminate ? __(ToggleIndeterminateCheckBox) : undefined,
                onCheck: (event: any, checked: boolean) => onToggleAll(indeterminate ? true : checked),
            }),
            headerStyle: {
                textAlign: "initial",
            },
            accessor: (row: INodeTableRow<T>) => row,
            sortable: false,
            resizable: false,
            width: 32,
            Cell: (prop: { value: INodeTableRow<T>, index: number }) => __(Checkbox, {
                checked: prop.value.toggled || false,
                onCheck: (event: any, checked: boolean) => props.onRowToggled!(prop.value.node, checked, prop.index),
            }),
        });
    }
    const columns: Column[] = props.columns.map(createColumn);

    const sorted: SortingRule[] = props.columns.map(createSortingRule).filter(c => !!c) as SortingRule[];

    const translations = props.translations ? {
        previousText: props.translations[NodeTableTranslations.PREVIOUS],
        nextText: props.translations[NodeTableTranslations.NEXT],
        loadingText: props.translations[NodeTableTranslations.LOADING],
        noDataText: props.isLoading ? "" : props.translations[NodeTableTranslations.NODATA],
        pageText: props.translations[NodeTableTranslations.PAGE],
        ofText: props.translations[NodeTableTranslations.OF],
        rowsText: props.translations[NodeTableTranslations.ROWS],
    } : {};
    return __(ReactTable, {
        manual: true,
        data: props.rows,
        columns: firstColumns.concat(columns),

        showPageSizeOptions: false,
        onPageChange: (index: number) => props.onPageChanged(index + 1),
        page: props.pager.selectedPage - 1,
        minRows: props.pager.pageSize,
        pageSize: props.pager.pageSize,
        pages: Math.ceil(props.pager.totalItems / props.pager.pageSize),

        multiSort: false,
        sorted,
        onSortedChange: (newSorted: SortingRule[], column: Column, additive: boolean) => {
            const sorts: INodeTableBasicColumn[] = props.columns.map(col => sortingRuleToBasicColumn(col, newSorted));
            props.onSortChanged(sorts);
        },
        getTrProps: (state: TableProps, rowInfo?: RowInfo) => (rowInfo ? {
            style: rowInfo.original.rowStyle,
        } : {}),
        getTdProps: (state: TableProps, rowInfo?: RowInfo, column?: Column) => (rowInfo && column ? {
            onClick: column.id!.startsWith("--norowselect-") ? undefined : (event: MouseEvent<any>) => {
                props.onRowSelected(rowInfo.original.node, rowInfo.index);
            },
        } : {}),
        loading: props.isLoading,
        ...translations,
    });

}

function sortingRuleToBasicColumn(col: INodeTableBasicColumn, rules: SortingRule[]): INodeTableBasicColumn {
    const sortingRule = rules.find(sort => sort.id === col.name);
    if (!sortingRule) {
        return {
            name: col.name,
            sortDirection: NodeTableSortDirection.NONE,
        };
    }

    return {
        name: col.name,
        sortDirection: sortingRule.desc ? NodeTableSortDirection.DESC : NodeTableSortDirection.ASC,
    };
}

function createSortingRule(col: INodeTableBasicColumn): SortingRule | null {
    if (col.sortDirection === NodeTableSortDirection.NONE) {
        return null;
    }

    return {
        id: col.name,
        desc: col.sortDirection === NodeTableSortDirection.DESC || undefined,
        asc: col.sortDirection === NodeTableSortDirection.ASC || undefined,
    };
}

function createColumn(col: INodeTableColumn): Column {
    return {
        id: col.name,
        Header: col.label,
        accessor: (row: INodeTableRow<any>) => row,
        sortable: col.sortable,
        Cell: (prop: {value: INodeTableRow<any>}) => __(col.renderer, {
            node: prop.value.node,
            row: 0,
            highlights: prop.value.highlights || [],
        }),
    };
}

type RowMenu_Props_t<T> = {
    menuItems: Array<MenuItem_t<T>>
    onMenuItemSelected: (menuKey: T, menuIndex: number) => void,
};

function RowMenu<T>({ menuItems, onMenuItemSelected }: RowMenu_Props_t<T>) {
    return __(IconMenu, {
        iconButtonElement: __(IconButton, { style: { padding: "0", height: "initial" }, disableTouchRipple: true },
            __(MoreHorizIcon, { color: "grey" })),
        targetOrigin: { horizontal: "right", vertical: "top" },
        anchorOrigin: { horizontal: "right", vertical: "top" },
    },
        menuItems.map((mi, i) =>
            __(MenuItem, {
                key: i,
                primaryText: mi.label,
                disabled: mi.disabled,
                onClick: (event: MouseEvent<any>) => {
                    onMenuItemSelected(mi.key, i);
                    event.stopPropagation();
                    event.preventDefault();
                },
            }),
        ),
    );
}
