import { IconButton, InputAdornment, Popover, TextField } from "@material-ui/core";
import CalendarIcon from "@material-ui/icons/Event";
import DatePicker from "material-ui-pickers/DatePicker/DatePicker";
import DateTimePicker from "material-ui-pickers/DateTimePicker/DateTimePicker";
import React, { ChangeEvent, useCallback, useReducer, useRef } from "react";
import invariant from "tiny-invariant";

export type DateOrTextInputProps = {
    readonly textValue: string;
    readonly dateValue: Date | null;

    readonly onTextChange: (value: string) => void;
    readonly onDateChange: (value: Date) => void;

    readonly includeTime: false | "24h" | "12h";
};

type LocalState = {
    pickerOpen: boolean,
    currentDate: null | Date,
};

const defaultLocalState: LocalState = {
    pickerOpen: false,
    currentDate: null,
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

function localStateReducer(state: LocalState, action: LocalAction): Partial<LocalState> {
    switch (action.type) {
        case "close":
        default:
            return {
                pickerOpen: false,
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
    }
}

export default function DateOrTextInput(props: DateOrTextInputProps) {
    const [localState, updateLocalState] = useReducer(localStateReducer, defaultLocalState);

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
