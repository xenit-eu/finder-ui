import DateFnsUtils from "@date-io/date-fns";
import { action } from "@storybook/addon-actions";
import scoreStringSimilarity from "@xenit/finder-string-similarity-score";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import React from "react";
import DateComponent from "./DateOrText";

export default {
    title: "searchbar/renderer/DateOrText",
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

export const normalText = () => <Wrapper>
    <DateComponent value={"some text"} includeTime={false} />
</Wrapper>;

export const withTime = () => <Wrapper>
    <DateComponent value={date} includeTime={true} />
</Wrapper>;

export const empty = () => <Wrapper>
    <DateComponent value={null} includeTime={false} />
</Wrapper>;

export const editable = () => <Wrapper>
    <DateComponent value={date} onChange={action("change")} includeTime={false} />
</Wrapper>;

export const editableWithText = () => <Wrapper>
    <DateComponent value={"some text"} onChange={action("change")} includeTime={false} />
</Wrapper>;

export const editableWithTime = () => <Wrapper>
    <DateComponent value={date} onChange={action("change")} includeTime={true} />
</Wrapper>;

export const highlighted = () => <Wrapper>
    <DateComponent value={date} similarity={scoreStringSimilarity("2020", date.toDateString())} includeTime={false}/>
</Wrapper>;
