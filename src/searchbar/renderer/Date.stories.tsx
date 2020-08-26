import DateFnsUtils from "@date-io/date-fns";
import { action } from "@storybook/addon-actions";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import React from "react";
import DateComponent from "./Date";

export default {
    title: "searchbar/renderer/Date",
    component: DateComponent,
};

function Wrapper({ children }) {
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {children}
    </MuiPickersUtilsProvider>;
}

const date = new Date("2020-05-08 10:22:40");

export const normal = () => <Wrapper>
    <DateComponent value={date} includeTime={false} />
</Wrapper>;

export const withTime = () => <Wrapper>
    <DateComponent value={date} includeTime={true} />
</Wrapper>;

export const empty = () => <Wrapper>
    <DateComponent value={null} />
</Wrapper>;

export const editable = () => <Wrapper>
    <DateComponent value={date} onChange={action("change")} includeTime={false} />
</Wrapper>;

export const editableWithTime = () => <Wrapper>
    <DateComponent value={date} onChange={action("change")} includeTime={true} />
</Wrapper>;
