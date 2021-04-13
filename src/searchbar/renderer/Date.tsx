import { TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import { FieldRendererComponentProps } from "../FieldRenderer";
import { RenderSimilarity } from "../Similarity";
import DateOrTextInput, {DateOrTextInputProps} from "./_DateOrTextInput";
import HighlightComponent from "./HighlightComponent";

type DateComponent_Props_t = {
    includeTime: boolean,
};

function empty() {}
export default function DateComponent(props: FieldRendererComponentProps<Date, DateComponent_Props_t>) {
    const { t } = useTranslation("finder-ui");

    function renderDate(date: Date) {
        if (props.includeTime) {
            return t("searchbar/renderer/Date/date-time", { date: props.value });
        } else {
            return t("searchbar/renderer/Date/date", { date: props.value });
        }
    }

    function getTimeType(): DateOrTextInputProps["includeTime"] {
        if (!props.includeTime) {
            return false;
        }
        let hasAmpm = /am|pm/i.test(renderDate(new Date()));
        if (hasAmpm) {
            return "12h";
        } else {
            return "24h";
        }
    }

    if (props.onChange) {
        return <DateOrTextInput
            textValue={renderDate(props.value!)}
            dateValue={props.value}
            onTextChange={empty}
            onDateChange={props.onChange}
            includeTime={getTimeType()}
        />;
    } else {
        if (!props.value) {
            return <EmptyDate />;
        } else {
            return <RenderSimilarity text={props.similarity ?? renderDate(props.value)} highlightComponent={HighlightComponent} />;
        }
    }
}

const emptyDateStyle = (theme: Theme) => ({
    root: {
        color: theme.palette.text.disabled,
    },
});

function EmptyDate_(props: WithStyles<typeof emptyDateStyle>) {
    const { t } = useTranslation("finder-ui");
    return <span className={props.classes.root}>{t("searchbar/renderer/Date/null-date")}</span>;
}

const EmptyDate = withStyles(emptyDateStyle)(EmptyDate_);
