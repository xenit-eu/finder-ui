import { Chip, StyledComponentProps, withStyles } from "@material-ui/core";
import { createElement as __ } from "react";
import { Column_t } from "..";

type ColumnChip_Props_t = {
    column: Column_t,
    selectedColumns: string[],
    onClick?: () => void,
    onDelete?: () => void,
} & StyledComponentProps<"root">;

function ColumnChip(props: ColumnChip_Props_t) {
    return __(Chip, {
        className: props.classes!.root,
        label: props.column.label,
        onClick: props.column.fixed ? undefined : props.onClick,
        onDelete: props.column.fixed ? undefined : props.onDelete,
        color: props.selectedColumns.indexOf(props.column.name) >= 0 ? "primary" : "default",
    });
}

export default withStyles(theme => ({
    root: {
        margin: theme.spacing.unit / 2,
    },
}))(ColumnChip);
