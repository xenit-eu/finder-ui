import { action } from "@storybook/addon-actions";
import * as React from "react";
import SnackbarNotification from "./SnackbarNotification";

export default {
    title: "snackbar/SnackbarNotification",
    component: SnackbarNotification,
};

export const info = () => <SnackbarNotification
    variant="info"
    message="Info message"
    onClose={action("close")}
/>;

export const success = () => <SnackbarNotification
    variant="success"
    message="Success message"
    onClose={action("close")}
/>;

export const warning = () => <SnackbarNotification
    variant="warning"
    message="Warning message"
    onClose={action("close")}
/>;

export const error = () => <SnackbarNotification
    variant="error"
    message="Error message"
    onClose={action("close")}
/>;
