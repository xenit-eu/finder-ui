import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import React from "react";

const styles = (theme: Theme) => ({
    root: {

    },
    separator: {
        display: "flex",
        userSelect: "none",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.palette.text.hint,
    } as CSSProperties,

    ol: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        padding: 0,
        margin: 0,
        listStyle: "none",

    } as CSSProperties,
    li: {

    },
});

export type BreadcrumbsBase_Props_t = {
    children: React.ReactNode,
    separator?: React.ReactNode,
};

function BreadcrumbsBase({ children, separator = "/", classes }: BreadcrumbsBase_Props_t & WithStyles<typeof styles>) {
    const childArray = React.Children.toArray(children);
    const childNodes = childArray.length > 0 ? [
        <li className={classes.li} key={"child-0"}>{childArray[0]}</li>,
    ] : [];

    for (let i = 1; i < childArray.length; i++) {
        childNodes.push(<li className={classes.separator} key={"separator-" + i} role="separator" aria-hidden="true">{separator}</li>);
        childNodes.push(<li className={classes.li} key={"child-" + i}>{childArray[i]}</li>);
    }

    return <nav className={classes.root}>
        <ol className={classes.ol}>
            {childNodes}
        </ol>
    </nav>;

}

export default withStyles(styles, { name: "FinderBreadcrumbs" })(BreadcrumbsBase);
