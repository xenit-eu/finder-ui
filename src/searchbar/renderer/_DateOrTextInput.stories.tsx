import DateFnsUtils from "@date-io/date-fns";
import { action } from "@storybook/addon-actions";
import scoreStringSimilarity from "@xenit/finder-string-similarity-score";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import React from "react";
import DateOrTextInput from "./_DateOrTextInput";

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
        onChangeText={action("changeText")}
        onChangeDate={action("changeDate")}
        includeTime={false}
    />
</Wrapper>;

export const dateTimeAmpm = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onChangeText={action("changeText")}
        onChangeDate={action("changeDate")}
        includeTime={"12h"}
    />
</Wrapper>;

export const dateTime24h = () => <Wrapper>
    <DateOrTextInput
        textValue={"blabla"}
        dateValue={date}
        onChangeText={action("changeText")}
        onChangeDate={action("changeDate")}
        includeTime={"24h"}
    />
</Wrapper>;
