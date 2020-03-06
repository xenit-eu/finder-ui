import { Divider, ListSubheader, WithStyles, withStyles } from "@material-ui/core";
import { createElement as __, Fragment, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { Column_t, ColumnGroup_t } from "..";
import ColumnChip from "./chip";

type AvailableColumns_Props_t = {
    availableColumns: ColumnGroup_t[],
    selectedColumns: string[],
    onClickColumn: (col: Column_t) => void,
} & WithStyles<typeof availableColumnsStyle>;

function AvailableColumns(props: AvailableColumns_Props_t): ReactElement {
    return _.div({
        key: "AvailableColumns",
        className: props.classes.root + " available-columns-test-handle",
    }, props.availableColumns.map((grouping, i) => __(Fragment, { key: i },
        __(ListSubheader, {
            className: props.classes.header,
            component: "div",
            disableSticky: true,
        }, grouping.label),
        _.div({
            className: props.classes.content,
        }, grouping.columns.map((columns, j) => __(Fragment,
            { key: j }, [
                j !== 0 ? __(Divider, { key: "divider", className: props.classes.divider }) : null,
                ...columns.map((column) => __(ColumnChip, {
                    key: column.name,
                    column,
                    onClick: () => {
                        return props.onClickColumn(column);
                    },
                    selectedColumns: props.selectedColumns,
                })),
            ]),
        ),
        ),
    )));
}

const availableColumnsStyle = {
    root: {},
    header: {},
    content: {
        flexShrink: "unset" as "unset",
    },
    divider: {
        margin: 0,
    },
};

export default withStyles(availableColumnsStyle)(AvailableColumns);
