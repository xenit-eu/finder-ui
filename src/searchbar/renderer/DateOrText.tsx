import { TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { InlineDatePicker, InlineDateTimePicker } from "material-ui-pickers";
import React, {ChangeEvent} from "react";
import { useTranslation } from "react-i18next";
import { FieldRendererComponentProps } from "../FieldRenderer";
import { RenderSimilarity } from "../Similarity";
import HighlightComponent from "./HighlightComponent";

type DateComponent_Props_t = {
    includeTime: boolean,
};

export default function DateOrTextComponent(props: FieldRendererComponentProps<Date|string, DateComponent_Props_t>) {
    const { t } = useTranslation("finder-ui");

    const renderDate = React.useCallback((date: Date|string) => {
        if (typeof date === "string") {
            return date;
        }
        if (props.includeTime) {
            return t("searchbar/renderer/Date/date-time", { date });
        } else {
            return t("searchbar/renderer/Date/date", { date });
        }
    }, [props.includeTime, t]);

    if (props.onChange) {
        const Picker = props.includeTime ? InlineDateTimePicker : InlineDatePicker;
        let hasAmpm = /am|pm/i.test(renderDate(new Date()));
        return <Picker
            keyboard
            value={props.value}
            onChange={(date: any | null) => {
                props.onChange!(new Date(date));
            }}
            clearable
            autoOk
            ampm={hasAmpm}
            cancelLabel={t("searchbar/renderer/Date/cancel")}
            okLabel={t("searchbar/renderer/Date/ok")}
            clearLabel={t("searchbar/renderer/Date/clear")}
            emptyLabel={t("searchbar/renderer/Date/null-date")}
            labelFunc={(date: any, invalidLabel: string) => {
                if (date) {
                    return renderDate(new Date(date));
                } else {
                    return invalidLabel;
                }
            }}
            TextFieldComponent={(internalProps: TextFieldProps) => <TextField
                {...(typeof props.value === "string" ? {
                    ...internalProps,
                    value: props.value,
                    error: false,
                    helperText: null,
                } : internalProps)}
                fullWidth
                onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                    props.onChange!(ev.target.value);
                }}
            />}
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
