import {ComponentType, createElement as __, ReactNode} from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, WithStyles, withStyles} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

type ConfigurationExpansionPanel_t = {
    title: string,
    children?: ReactNode[] | ReactNode,
} & WithStyles<"expansionPanelDetails">;

function ConfigurationExpansionPanel(props: ConfigurationExpansionPanel_t) {
    return __(ExpansionPanel, {defaultExpanded: true},
        __(ExpansionPanelSummary, {expandIcon: __(ExpandMoreIcon, {})},
            __(Typography, {}, props.title)),
        __(ExpansionPanelDetails, {className: props.classes.expansionPanelDetails, children: props.children}),
    );
}

const comp: ComponentType<ConfigurationExpansionPanel_t> = ConfigurationExpansionPanel;

export default withStyles(theme => ({
    expansionPanelDetails: <CSSProperties> {
        // display: "flex",
        flexDirection: "column",
    },
}))(comp);
