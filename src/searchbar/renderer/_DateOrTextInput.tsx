import { IconButton, InputAdornment, Popover, TextField } from "@material-ui/core";
import CalendarIcon from "@material-ui/icons/Event";
import DatePicker from "material-ui-pickers/DatePicker/DatePicker";
import DateTimePicker from "material-ui-pickers/DateTimePicker/DateTimePicker";
import React, { ChangeEvent, useCallback, useReducer, useRef } from "react";

// @internal
export const forcePickerStateOpen = Symbol("forcePickerStateOpen");

export type DateOrTextInputProps = {
    readonly textValue: string;
    readonly dateValue: Date | null;

    readonly onTextChange: (value: string) => void;
    readonly onDateChange: (value: Date) => void;

    readonly includeTime: false | "24h" | "12h";

    // @internal
    readonly _forcePickerState?: typeof forcePickerStateOpen;
};

type LocalState = {
    pickerOpen: boolean,
    currentDate: null | Date,
};

type LocalAction = {
    type: "close",
} | {
    type: "open",
} | {
    type: "pick",
    date: Date,
    commit: boolean,
};

function localStateReducer(state: LocalState, action: LocalAction): LocalState {
    switch (action.type) {
        case "close":
            return {
                pickerOpen: false,
                currentDate: state.currentDate,
            };
        case "open":
            return {
                pickerOpen: true,
                currentDate: null,
            };
        case "pick":
            return {
                pickerOpen: !action.commit,
                currentDate: action.date,
            };
        default:
            return state;
    }
}

export default function DateOrTextInput(props: DateOrTextInputProps) {
    const [localState, updateLocalState] = useReducer(localStateReducer, {
        pickerOpen: props._forcePickerState === forcePickerStateOpen,
        currentDate: null,
    });

    const calendarIconOnClick = useCallback(() => {
        updateLocalState({type: "open"});
    }, [updateLocalState]);

    const onClose = useCallback(() => {
        updateLocalState({ type: "close" });
    }, [updateLocalState]);

    const textOnChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        props.onTextChange(ev.target.value);
    }, [props.onTextChange]);

    const dateOnChange = useCallback((date: any, isValid: boolean) => {
        const newDate = new Date(date);
        if (isValid) {
            props.onDateChange(newDate);
        }
        updateLocalState({
            type: "pick",
            date: newDate,
            commit: isValid,
        });
    }, [updateLocalState, props.onDateChange]);

    const Picker = props.includeTime ? DateTimePicker : DatePicker;
    const inputRef = useRef();

    return <>
        <TextField
            inputRef={inputRef}
            value={props.textValue}
            onChange={textOnChange}
            fullWidth
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton onClick={calendarIconOnClick}>
                        <CalendarIcon />
                    </IconButton>
                </InputAdornment>,
            }}
        />
        <Popover
            open={localState.pickerOpen}
            anchorEl={inputRef.current}
            onClose={onClose}
        >
            <Picker
                date={localState.currentDate ?? props.dateValue ?? new Date()}
                onChange={dateOnChange}
                ampm={props.includeTime === "12h"}
                allowKeyboardControl
            />
        </Popover>
    </>;

}
