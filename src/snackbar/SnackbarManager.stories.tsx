import * as React from "react";
import SnackbarManager, { SnackbarManager_Message_t } from "./SnackbarManager";

export default {
    title: "snackbar/SnackbarManager",
    component: SnackbarManager,
};

function InteractiveSnackbarManager() {
    const [messages, setMessages] = React.useState([] as SnackbarManager_Message_t[]);
    return <>
        <button onClick={() => setMessages(messages.concat([{
            type: "error",
            message: "An error message that doesn't expire.",
            expires: false,
        }]))}>Put nonexpiring error</button>
        <button onClick={() => setMessages(messages.concat([{
            type: "info",
            message: "An info message",
            expires: true,
        }]))}>Put info message</button>
        <SnackbarManager
            messages={messages}
            onMessageExpired={(message) => setMessages(messages.filter((m) => m !== message))}
        />
    </>;
}

export const interactive = () => <InteractiveSnackbarManager />;

interactive.story = {
    parameters: {
        storyshots: { disable: true },
    },
};

function DelayedSnackbarManager(props: any) {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    });

    return <SnackbarManager {...props} messages={visible ? props.messages : []} />;

}

export const withUnexpiringError = () => <DelayedSnackbarManager
    messages={[
        {
            type: "error",
            message: "An error message that doesn't expire",
            expires: false,
        },
        {
            type: "info",
            message: "You dismissed the error message!",
            expires: true,
        },
    ]}
/>;

export const withUnexpiringErrorTrace = () => <DelayedSnackbarManager
    messages={[
        {
            type: "error",
            message: "An error message with a trace",
            trace: new Error().stack,
        },
        {
            type: "info",
            message: "You dismissed the error message!",
            expires: true,
        },
    ]}
/>;
