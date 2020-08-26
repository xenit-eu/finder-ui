import { TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { InlineDatePicker, InlineDateTimePicker } from "material-ui-pickers";
import React from "react";
import { useTranslation } from "react-i18next";
import { FieldRendererComponentProps } from "../FieldRenderer";

type DateComponent_Props_t = {
    includeTime: boolean,
};

function FullWidthTextField(props: TextFieldProps) {
    return <TextField {...props} fullWidth />;
}

export default function DateComponent(props: FieldRendererComponentProps<Date, DateComponent_Props_t>) {
    const { t } = useTranslation("finder-ui");

    function renderDate(date: Date) {
        if (props.includeTime) {
            return t("searchbar/renderer/Date/date-time", { date: props.value });
        } else {
            return t("searchbar/renderer/Date/date", { date: props.value });
        }
    }

    if (props.onChange) {
        const Picker = props.includeTime ? InlineDateTimePicker : InlineDatePicker;
        let hasAmpm = /am|pm/i.test(renderDate(new Date()));
        return <Picker
            value={props.value}
            onChange={(date: Date|null) => props.onChange!(date)}
            clearable
            autoOk
            ampm={hasAmpm}
            cancelLabel={t("searchbar/renderer/Date/cancel")}
            okLabel={t("searchbar/renderer/Date/ok")}
            clearLabel={t("searchbar/renderer/Date/clear")}
            emptyLabel={t("searchbar/renderer/Date/null-date")}
            labelFunc={(date: Date, invalidLabel: string) => {
                if (date) {
                    return renderDate(date);
                } else {
                    return invalidLabel;
                }
            }}
            TextFieldComponent={FullWidthTextField}
        />;
    } else {
        if (!props.value) {
            return <EmptyDate />;
        } else {
            return <>{renderDate(props.value)}</>;
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
