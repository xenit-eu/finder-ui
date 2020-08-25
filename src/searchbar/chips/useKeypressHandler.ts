import keycode from "keycode";
import { KeyboardEvent } from "react";
type KeypressHandlerOpts = {
    readonly onModify?: () => void,
    readonly onExit?: () => void,
    readonly onCommit?: () => void,
    readonly stopPropagation?: boolean,
};
export default function useKeypressHandler(opts: KeypressHandlerOpts) {
    const stopPropagation = opts.stopPropagation ? (ev: KeyboardEvent) => ev.stopPropagation() : () => { };
    return (keyboardEvent: KeyboardEvent) => {
        const nativeEvent = keyboardEvent.nativeEvent;
        if (keycode.isEventKey(nativeEvent, "esc") && opts.onExit) {
            opts.onExit();
            stopPropagation(keyboardEvent);
        } else if (keycode.isEventKey(nativeEvent, "enter") && opts.onCommit) {
            opts.onCommit();
            stopPropagation(keyboardEvent);
        } else if (keycode.isEventKey(nativeEvent, "f2") && opts.onModify) {
            opts.onModify();
            stopPropagation(keyboardEvent);
        }
    };
}
