import Chip from "@material-ui/core/Chip";
import { Theme, withStyles } from "@material-ui/core/styles";

const style = (theme: Theme) => ({
    root: {
        "backgroundColor": theme.palette.grey[100],
        "height": theme.spacing.unit * 3,
        "color": theme.palette.grey[800],
        "fontWeight": theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: theme.palette.grey[300],
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.grey[300],
        },
    },
    avatar: {
        height: "100%",
        marginRight: -theme.spacing.unit,
    },

});

export default withStyles(style, { name: "FinderChipBreadcrumb" })(Chip) as typeof Chip;
