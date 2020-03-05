import { Chip, Theme, WithStyles, withStyles } from "@material-ui/core";
import { createElement as __, ReactElement } from "react";
import { Column_t } from "..";

type ColumnChip_Props_t = {
    column: Column_t,
    selectedColumns: string[],
    onClick?: () => void,
    onDelete?: () => void,
} & WithStyles<typeof columnChipStyles>;

function ColumnChip(props: ColumnChip_Props_t): ReactElement {
    return __(Chip, {
        className: props.classes.root + " column-chip-test-handle",
        label: props.column.label,
        onClick: props.column.fixed ? undefined : props.onClick,
        onDelete: props.column.fixed ? undefined : props.onDelete,
        color: props.selectedColumns.indexOf(props.column.name) >= 0 ? "primary" : "default",
    });
}

const columnChipStyles = (theme: Theme) => ({
    root: {
        margin: theme.spacing.unit / 2,
    },
});

export default withStyles(columnChipStyles)(ColumnChip);
