import { withStyles, WithStyles } from "@material-ui/core";
import { ReactNode, ComponentType } from "react";
import * as _ from "react-dom-factories";

type FullWidthFlexcontainer_t =  WithStyles<"flex"> & {children?: ReactNode[] | ReactNode};

function FullWidthFlexContainer(props: FullWidthFlexcontainer_t) {
    return _.div({className: props.classes.flex, children: props.children});
}

const comp: ComponentType<FullWidthFlexcontainer_t> = FullWidthFlexContainer;

export default withStyles(theme => ({
    flex: {
        display: "flex",
        width: "100%",
    },
}))(comp) ;
