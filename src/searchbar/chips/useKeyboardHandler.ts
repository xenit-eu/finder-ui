import { codes, isEventKey } from "keycode";
import { KeyboardEvent } from "react";

type KeyboardKeyHandlers = {
    [k in keyof typeof codes]?: (ev: KeyboardEvent) => void;
};

export interface IKeyboardHandlerOpts {
    /**
     * Specifies whether Event.stopPropagation() is called for every matching keycode
     */
    readonly stopPropagation?: boolean;
    /**
     * Specifies whether these eventhandlers are "default" handlers that won't be called after Event.preventDefault() is called
     */
    readonly isDefault?: boolean;

    /**
     * Specifies whether Event.preventDefault() is called for every matching keycode
     */
    readonly preventDefault?: boolean;

}

export default function useKeyboardHandler(handlers: KeyboardKeyHandlers, opts: IKeyboardHandlerOpts = {}) {
    return (keyboardEvent: KeyboardEvent) => {
        const nativeEvent = keyboardEvent.nativeEvent;
        for (const [key, callback] of Object.entries(handlers)) {
            if (callback && isEventKey(nativeEvent, key)) {
                if (!opts.isDefault || !keyboardEvent.isDefaultPrevented()) {
                    callback(keyboardEvent);
                }
                if (opts.preventDefault) {
                    keyboardEvent.preventDefault();
                }
                if (opts.stopPropagation) {
                    keyboardEvent.stopPropagation();
                }
            }
        }
    };
}
