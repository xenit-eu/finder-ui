import { Checkbox } from "material-ui";
import ToggleIndeterminateCheckBox from "material-ui/svg-icons/toggle/indeterminate-check-box";
import { createElement as __, CSSProperties, MouseEvent } from "react";
import ReactTable, { Column, Resize, ResizedChangeFunction, RowInfo, SortingRule, TableProps } from "react-table";
import "react-table/react-table.css";
import { FieldHighlights_t, Node_t } from "../metadata";
import { ColumnRenderer_t } from "./renderer/interface";
import RowMenu, { MenuItem_t } from "./RowMenu";
export { MenuItem_t as NodeTableRowMenuItem_t } from "./RowMenu";

export interface INodeTableBasicColumn {
    name: string;
    sortDirection: NodeTableSortDirection;
    width?: number | null;
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
type OnColumnResize_t = (sizes: INodeTableBasicColumn[]) => void;
type OnMenuSelected_t<T> = (node: Node_t, menuKey: T, rowIndex: number, menuIndex: number) => void;

export interface INodeTableRow<T> {
    node: Node_t; // The node to show in this row
    rowMenu: Array<MenuItem_t<T>>; // The menu items to show for this node
    toggled?: boolean; // Whether the node has its checkbox enabled or not (only effective when togglable is true)
    rowStyle: CSSProperties; // Additional CSS properties to apply to the row
    highlights?: FieldHighlights_t[];
};

type NodeTableMenuLoad_Callback_t<T> = (menuItemIndex: number, menuItem: MenuItem_t<T>) => void;
export interface INodeTableProps<T> {
    rows: Array<INodeTableRow<T>>; // List of rows to show in the table
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
    onRowMenuLoadRequested?: (node: Node_t, rowIndex: number, callback: NodeTableMenuLoad_Callback_t<T>) => Promise<void>;
    onRowMenuItemClicked: OnMenuSelected_t<T>; // Called when a row menu item is selected
    onSortChanged: OnColumnSort_t; // Called when a column has to be sorted
    onColumnResized?: OnColumnResize_t;
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
                onMenuLoadRequested: (callback) => {
                    if (props.onRowMenuLoadRequested) {
                        return props.onRowMenuLoadRequested(prop.value.node, prop.index, callback);
                    }
                    return Promise.resolve();
                },
                onMenuItemSelected: (menuKey: T, menuIndex: number) => {
                    props.onRowMenuItemClicked(prop.value.node, menuKey, prop.index, menuIndex);
                },
            }),
        },
    ];

    if (props.onRowToggled !== undefined) {
        const onToggleAllFallback = (checked: boolean) => props.rows.forEach((row, i) => props.onRowToggled!(row.node, checked, i));
        const onToggleAll = props.onToggleAll || onToggleAllFallback;
        const allRowsToggled = props.rows.every((row) => row.toggled || false);
        const noRowsToggled = props.rows.every((row) => !row.toggled);
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

    const sorted: SortingRule[] = props.columns.map(createSortingRule).filter((c) => !!c) as SortingRule[];

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
        showPageJump: false,
        onPageChange: (index: number) => props.onPageChanged(index + 1),
        page: props.pager.selectedPage - 1,
        minRows: props.pager.pageSize,
        pageSize: props.pager.pageSize,
        pages: Math.ceil(props.pager.totalItems / props.pager.pageSize),

        multiSort: false,
        sorted,
        onSortedChange: (newSorted: SortingRule[], column: Column, additive: boolean) => {
            const sorts: INodeTableBasicColumn[] = props.columns.map((col) => sortingRuleToBasicColumn(col, newSorted));
            props.onSortChanged(sorts);
        },
        onResizedChange: props.onColumnResized ? (newResizes: Resize[]) => {
            const resizes: INodeTableBasicColumn[] = props.columns.map((col) => resizeToBasicColumn(col, newResizes));
            props.onColumnResized!(resizes);
        } : undefined,
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
    const sortingRule = rules.find((sort) => sort.id === col.name);
    if (!sortingRule) {
        return {
            ...col,
            sortDirection: NodeTableSortDirection.NONE,
        };
    }

    return {
        ...col,
        sortDirection: sortingRule.desc ? NodeTableSortDirection.DESC : NodeTableSortDirection.ASC,
    };
}

function resizeToBasicColumn(col: INodeTableBasicColumn, resizes: Resize[]): INodeTableBasicColumn {
    const resize = resizes.find((r) => r.id === col.name);
    if (!resize) {
        return col;
    }

    return {
        ...col,
        width: resize.value as number,
    };
}

function createSortingRule(col: INodeTableBasicColumn): SortingRule | null {
    if (col.sortDirection === NodeTableSortDirection.NONE) {
        return null;
    }

    return {
        id: col.name,
        desc: col.sortDirection === NodeTableSortDirection.DESC,
    };
}

function createColumn(col: INodeTableColumn): Column {
    return {
        id: col.name,
        Header: col.label,
        accessor: (row: INodeTableRow<any>) => row,
        sortable: col.sortable,
        width: col.width ?? undefined,
        Cell: (prop: { value: INodeTableRow<any> }) => __(col.renderer, {
            node: prop.value.node,
            row: 0,
            highlights: prop.value.highlights || [],
        }),
    };
}
