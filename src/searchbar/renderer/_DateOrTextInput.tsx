import { IconButton, InputAdornment, Popover, TextField, Typography } from "@material-ui/core";
import CalendarIcon from "@material-ui/icons/Event";
import { withUtils, WithUtilsProps } from "material-ui-pickers/_shared/WithUtils";
import DatePicker from "material-ui-pickers/DatePicker/DatePicker";
import DateTimePicker from "material-ui-pickers/DateTimePicker/DateTimePicker";
import React, { ChangeEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import Activity from "../../global-activity-manager/Activity";

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

function DateOrTextInput(props: DateOrTextInputProps & WithUtilsProps) {
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
        <Activity active={localState.pickerOpen} waitForDeactivate>{(open, onDeactivate) =>
            <Popover
                open={open}
                anchorEl={inputRef.current}
                onClose={onClose}
                onExited={onDeactivate}
            >
                <Typography component="div">
                    <Picker
                        date={props.utils.date(localState.currentDate ?? props.dateValue ?? new Date())}
                        onChange={dateOnChange}
                        ampm={props.includeTime === "12h"}
                        allowKeyboardControl
                    />
                </Typography>
            </Popover>
        }</Activity>
    </>;

}

export default withUtils()(DateOrTextInput);
