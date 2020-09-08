import { Theme, WithStyles, withStyles } from "@material-ui/core";
import React, {useEffect, useRef} from "react";

type AutocompleteChips_Props_t = {
    children: React.ReactNode;
};

const styles = (theme: Theme) => ({
    root: {
        display: "flex" as const,
        overflowY: "auto" as const,
    },
    disabledAfterOverflowIndicator: {
        "&:after": {
            display: "none" as const,
        },
    },
    children: {
        "display": "flex" as const,
        "flexDirection": "row" as const,
        [theme.breakpoints.up("sm")]: {
            "& > *:first-child": {
                marginLeft: theme.spacing.unit * 3 / 2,
            },

        },
        "& > *": {
            marginLeft: theme.spacing.unit / 2,
            marginRight: theme.spacing.unit / 2,
        },
        "&:before, &:after": {
            flex: 0,
            content: "' '",
            position: "sticky" as const,
            paddingLeft: theme.spacing.unit,
        },
        "&:before": {
            left: 0,
            backgroundImage: "linear-gradient(90deg, " + theme.palette.background.paper + ", transparent)",
            marginRight: -theme.spacing.unit,
        },
        "&:after": {
            right: 0,
            backgroundImage: "linear-gradient(270deg, " + theme.palette.background.paper + ", transparent)",
        },
    },

});

function AutocompleteChips(props: AutocompleteChips_Props_t & WithStyles<typeof styles>) {
    const scrollableAreaRef = useRef<HTMLDivElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!scrollableAreaRef.current || !childrenContainerRef.current) {
            return;
        }
        const lastChild = childrenContainerRef.current.lastElementChild;
        if (!lastChild) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (!entries[0] || !childrenContainerRef.current) {
                return;
            }
            if (entries[0].intersectionRatio > 0.999) {
                childrenContainerRef.current.classList.add(props.classes.disabledAfterOverflowIndicator);
            } else {
                childrenContainerRef.current.classList.remove(props.classes.disabledAfterOverflowIndicator);
            }
        }, {
            root: scrollableAreaRef.current,
            threshold: 1.0,
        });

        observer.observe(lastChild);

        return () => observer.disconnect();
    }, [scrollableAreaRef.current, childrenContainerRef.current]);
    return <div className={props.classes.root} ref={scrollableAreaRef}>
        <div className={props.classes.children} ref={childrenContainerRef}>
            {props.children}
        </div>
    </div>;
}

export default withStyles(styles)(AutocompleteChips);
