import { KeyboardEvent } from "react";
import useKeyboardHandler, {IKeyboardHandlerOpts} from "./useKeyboardHandler";
interface IKeypressHandlerOpts  extends IKeyboardHandlerOpts {
    readonly onModify?: () => void;
    readonly onExit?: () => void;
    readonly onCommit?: () => void;
    readonly onDelete?: () => void;
};
export default function useKeypressHandler(opts: IKeypressHandlerOpts) {
    const wrap = (fn?: () => void) => (ev: KeyboardEvent) => {
        if (fn) {
            fn();
        }
    };

    return useKeyboardHandler({
        "esc": wrap(opts.onExit),
        "enter": wrap(opts.onCommit),
        "f2": wrap(opts.onModify),
        "backspace": wrap(opts.onDelete),
        "delete": wrap(opts.onDelete),
    }, opts);
}
