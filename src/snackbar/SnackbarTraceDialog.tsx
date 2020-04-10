import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog } from "@material-ui/core";
import * as React from "react";
import { SnackbarManager_Message_t } from "./SnackbarManager";
import { SnackbarTraceHeaderConsumer } from "./SnackbarTraceHeaderProvider";

type SnackbarTraceDialog_Props_t = {
    message: SnackbarManager_Message_t,
    open: boolean,
    fullScreen?: boolean,
    onClose: () => void,
};

function createTraceMessage(message: SnackbarManager_Message_t, headers: { [k: string]: string }): string {
    const messages = [
        "-----BEGIN FINDER TRACE ----",
        "Type: " + message.type,
        "Message: " + message.message,
    ];
    for (const header of Object.keys(headers)) {
        messages.push(header + ": " + headers[header]);
    }
    if (message.trace) {
        messages.push("");
        messages.push(message.trace);
    }
    messages.push("-----END FINDER TRACE-----");

    return messages.join("\n");
}

function SnackbarTraceDialog({ message, onClose, ...props }: SnackbarTraceDialog_Props_t) {
    const preRef = React.createRef<HTMLPreElement>();
    return <Dialog
        {...props}
        scroll="paper"
        onClose={() => onClose()}
        fullWidth={true}
        maxWidth={false}
    >
        <DialogTitle>Trace: {message.message}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <SnackbarTraceHeaderConsumer>{
                    (headers) =>
                        <pre ref={preRef}>{createTraceMessage(message, headers)}</pre>
                }</SnackbarTraceHeaderConsumer>
            </DialogContentText>
        </DialogContent>

        <DialogActions>
            <Button onClick={() => {
                document.getSelection()?.removeAllRanges();

                const copyRange = document.createRange();
                copyRange.selectNodeContents(preRef.current!);
                document.getSelection()?.addRange(copyRange);

                document.execCommand("copy");
            }}>
                Copy trace
            </Button>
            <Button onClick={() => onClose()}>
                Close
            </Button>
        </DialogActions>
    </Dialog>;
}

export default withMobileDialog<SnackbarTraceDialog_Props_t>()(SnackbarTraceDialog);
