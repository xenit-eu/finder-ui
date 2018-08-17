import { Paper } from "@material-ui/core";
import { createElement as __ } from "react";
import { arrayMove, SortableContainer, SortableElement, SortEnd } from "react-sortable-hoc";
import { Column_t } from "..";
import ColumnChip from "./chip";

const SortableColumnChip = SortableElement(({ column, onDelete }: { column: Column_t, onDelete: () => void }) => __(ColumnChip, {
    column,
    selectedColumns: [],
    onDelete,
}));

const SortableColumnsInternal = SortableContainer(({ columns, onDeleteColumn }: { columns: Column_t[], onDeleteColumn: (column: Column_t) => void }) => {
    return __(Paper, {}, columns.map((column, i) => __(SortableColumnChip, { key: i, column, onDelete: () => onDeleteColumn(column), index: i })));
});

type SortableColumns_Props_t = {
    columns: Column_t[],
    onDeleteColumn: (col: Column_t) => void,
    onSortColumns: (col: Column_t[]) => void,
};

export default function SortableColumns(props: SortableColumns_Props_t) {
    return __(SortableColumnsInternal, {
        axis: "xy",
        columns: props.columns,
        helperClass: "columns-picker-sortable-helper",
        lockToContainerEdges: true,
        distance: 1,
        lockOffset: ["0%", "0%"],
        onSortEnd: ({ oldIndex, newIndex }: SortEnd) => {
            props.onSortColumns(arrayMove(props.columns, oldIndex, newIndex));
        },
        onDeleteColumn: props.onDeleteColumn,
    });
}
