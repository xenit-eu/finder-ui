import DateFnsUtils from "@date-io/date-fns";
import { action } from "@storybook/addon-actions";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import React from "react";
import DateOrTextInput, { forcePickerStateOpen } from "./_DateOrTextInput";

export default {
    title: "searchbar/renderer/DateOrTextInput",
    component: DateOrTextInput,
};

function Wrapper({ children }) {
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {children}
    </MuiPickersUtilsProvider>;
}

const date = new Date("2020-05-08 10:22:40");

export const dateOnly = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={false}
    />
</Wrapper>;

export const dateTimeAmpm = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={"12h"}
    />
</Wrapper>;

export const dateTime24h = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={"24h"}
    />
</Wrapper>;

export const dateOnlyOpen = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={false}
        _forcePickerState={forcePickerStateOpen}
    />
</Wrapper>;

export const dateTimeAmpmOpen = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={"12h"}
        _forcePickerState={forcePickerStateOpen}
    />
</Wrapper>;

export const dateTime24hOpen = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onTextChange={action("textChange")}
        onDateChange={action("dateChange")}
        includeTime={"24h"}
        _forcePickerState={forcePickerStateOpen}
    />
</Wrapper>;
