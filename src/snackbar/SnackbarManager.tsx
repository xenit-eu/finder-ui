import { Snackbar, withTheme, WithTheme } from "@material-ui/core";
import { arrayEquals } from "@xenit/finder-utils";
import * as React from "react";
import SnackbarNotification, { SnackbarNotification_Variant_t } from "./SnackbarNotification";
import SnackbarTraceDialog from "./SnackbarTraceDialog";

export type SnackbarManager_Message_t = {
    type: SnackbarNotification_Variant_t,
    message: string,
    expires?: boolean,
    trace?: string,
};

type SnackbarManager_Props_t<Message extends SnackbarManager_Message_t> = {
    messages: readonly Message[],
    onMessageExpired?: (message: Message) => void,
};

function findNextMessage<T extends SnackbarManager_Message_t>(messages: readonly T[], closedMessages: readonly T[]): { next: T | null, closedMessages: T[] } {
    let next = null;
    const newClosedMessages: T[] = [];
    for (const message of messages) {
        if (closedMessages.indexOf(message) === -1) {
            if (next === null) {
                next = message;
            }
        } else {
            newClosedMessages.push(message);
        }
    }
    return { next, closedMessages: newClosedMessages };

}

export default function SnackbarManager<T extends SnackbarManager_Message_t>({ messages, onMessageExpired }: SnackbarManager_Props_t<T>) {
    let [closedMessages, setClosedMessages] = React.useState([] as readonly T[]);

    const { next: nextMessage, closedMessages: newClosedMessages } = findNextMessage(messages, closedMessages);
    if (!arrayEquals(newClosedMessages, closedMessages.slice())) {
        setClosedMessages(newClosedMessages);
    }

    return <AnimatedSnackbar
        message={nextMessage}
        onClose={() => {
            if (nextMessage) {
                if (onMessageExpired) {
                    onMessageExpired(nextMessage);
                }
                setClosedMessages((closed) => closed.concat([nextMessage]));
            }
        }}
    />;
}

type AnimatedSnackbar_Props_t<T extends SnackbarManager_Message_t> = {
    message: T | null,
    onClose: () => void,
};
function AnimatedSnackbar<T extends SnackbarManager_Message_t>({ message, onClose }: AnimatedSnackbar_Props_t<T>) {
    const [open, setOpen] = React.useState(false);
    const [traceDialogOpen, setTraceDialogOpen] = React.useState(false);
    React.useEffect(() => {
        setOpen(message !== null);
    }, [message]);

    if (message) {
        message = {
            expires: true,
            ...message,
        };
        if (message.trace) {
            message.expires = false;
        }
    }

    return <>
        <Snackbar
            key={message?.type + "@" + message?.message}
            open={!traceDialogOpen && open}
            onExited={() => {
                if (!traceDialogOpen) {
                    onClose();
                }
            }}
            autoHideDuration={6000}
            onClose={(event, reason) => {
                if (reason === "clickaway") {
                    return;
                }
                if (message?.expires) {
                    setOpen(false);
                }
            }}
        >
            <SnackbarNotification
                variant={message?.type || "info"}
                message={message?.message || ""}
                onClose={() => setOpen(false)}
                onTrace={message?.trace ? () => setTraceDialogOpen(true) : undefined}
            />
        </Snackbar>
        {message &&
            <SnackbarTraceDialog
                open={traceDialogOpen}
                message={message}
                onClose={() => setTraceDialogOpen(false)}
            />}
    </>;
}
