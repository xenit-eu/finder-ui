import { Checkbox, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Fade, List, ListItem, ListItemText, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useCallback, useContext } from "react";
import FilterTranslationsContext from "./FilterTranslationsContext";
import { IFilter, IFilterValue } from "./types";

type Filter_Props_t<T extends IFilterValue> = IFilter<T> & {
    readonly onOpenChange: (value: boolean) => void;
    readonly onValueClick: (value: T) => void;
};

const filterStyle = (theme: Theme) => ({
    summaryContent: {
        "maxWidth": "100%",
        "& > *": {
            flex: "1",
        },
    },
    expansion: {
        paddingLeft: 0,
        paddingRight: 0,

    },
    title: {
        overflow: "hidden" as const,
        textOverflow: "ellipsis" as const,
        whiteSpace: "nowrap" as const,
    },
    selectedItemsSummary: {
        overflow: "hidden" as const,
        textOverflow: "ellipsis" as const,
        whiteSpace: "nowrap" as const,
        color: theme.palette.text.hint,
        marginLeft: theme.spacing.unit,
    },

});

function Filter<T extends IFilterValue>({ classes, ...props }: Filter_Props_t<T> & WithStyles<typeof filterStyle>) {

    const onChange = useCallback((event, expanded: boolean) => props.onOpenChange(expanded), [props.onOpenChange]);
    const translator = useContext(FilterTranslationsContext);
    const selectedItems = props.values.filter((f) => f.selected);
    return <ExpansionPanel expanded={props.open} onChange={onChange}>
        <ExpansionPanelSummary classes={{
            content: classes.summaryContent,
        }} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.title} title={props.title}>{props.title}</Typography>
            {selectedItems.length ? <Fade in={!props.open} unmountOnExit>
                <Typography className={classes.selectedItemsSummary}>{selectedItems.map((f) => f.title).join(", ")}</Typography>
            </Fade> : null}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansion}>
            <FilterValueList {...props} />
        </ExpansionPanelDetails>
    </ExpansionPanel>;
}

export default withStyles(filterStyle)(Filter);

const filterValueListStyle = (theme: Theme) => ({
    list: {
        flex: 1,
        maxWidth: "100%",
    },
    listItem: {
        maxWidth: "100%",

    },
    listItemCheckbox: {
        position: "absolute" as const,
    },
    listItemText: {
        marginLeft: theme.spacing.unit * 4,
    },

    listItemBadge: {
        ...theme.typography.button,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        ...itemBadgeStyle(theme),
        display: "flex" as const,
        alignItems: "center" as const,
    },
});

function itemBadgeStyle(theme: Theme) {
    const height = Math.max(theme.spacing.unit * 2, theme.typography.fontSize + theme.spacing.unit);
    return {
        height,
        paddingLeft: theme.spacing.unit / 2,
        paddingRight: theme.spacing.unit / 2,
        borderRadius: height,
    };
}

function FilterValueList_<T extends IFilterValue>(props: Filter_Props_t<T> & WithStyles<typeof filterValueListStyle>) {
    return <List className={props.classes.list}>
        {props.values.map((value, i) => <FilterValueListItem value={value} props={props} key={i} />)}
    </List>;
}

const FilterValueList = withStyles(filterValueListStyle)(FilterValueList_);

function FilterValueListItem<T extends IFilterValue>({value, props}: { value: T, props: Filter_Props_t<T> & WithStyles<typeof filterValueListStyle> }) {
    const onClick = useCallback(() => props.onValueClick(value), [value, props.onValueClick]);
    const translator = useContext(FilterTranslationsContext);
    return <ListItem className={props.classes.listItem} onClick={onClick} button >
        <Checkbox className={props.classes.listItemCheckbox} checked={value.selected} disableRipple tabIndex={-1} />
        <ListItemText className={props.classes.listItemText} primary={translator.translateFilterValue(value)} />
        <span className={props.classes.listItemBadge}>{value.count}</span>
    </ListItem>;
}
