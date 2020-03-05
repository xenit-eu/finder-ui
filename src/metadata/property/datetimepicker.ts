import debug from "debug";
import DatePicker from "material-ui/DatePicker";
import { Component, createElement as __, FormEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";
const d = debug("finder-ui:metadata:property:datetimepicker");
import moment from "moment";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const DateTimePicker: PropertyRenderer_t<Date | Date[]> = (config: PropertyRenderConfig_t<Date | Date[]>) => {
    // tslint:disable-next-line:only-arrow-functions
    return function DateTimePicker(props: FieldSkeleton_Props_t) {
        const defaultValueString = config.parameters["override-default-value"] || null;
        let defaultValue = undefined;
        if (defaultValueString) {
            if (defaultValueString === "today") {
                defaultValue = new Date();
            } else {
                try {
                    defaultValue = new Date(Date.parse(defaultValueString));
                } catch (e) {
                    d("Can not parse default value %s to date: %O", defaultValueString, e);
                }
            }
        }

        const value = config.mapToView(props.node);
        const isMultiValue = Array.isArray(value);

        if (props.renderMode !== RenderMode.VIEW) {
            if (!isMultiValue) {
                return _.span({ className: "metadata-field metadata-field-datetimepicker" }, __(DatePicker, {
                    fullWidth: true,
                    autoOk: true,
                    container: "inline",
                    hintText: "Pick a date",
                    onChange: (evt: FormEvent<{}>, v: Date) => {
                        props.onChange(config.mapToModel(props.node, v));
                    },
                    defaultDate: defaultValue,
                    value: <Date> value,
                    formatDate: (date: Date) => moment(date).format(config.parameters["date-format"] || "Y/M/D"),
                }));
            } else {
                // TODO: Implement handling of multivalue fields
                return null;
            }
        } else {
            if (!value) {
                return null;
            }
            return _.span(
                { className: "metadata-value metadata-field-datetimepicker" },
                (Array.isArray(value) ? value : [value]).map(v => moment(v).format(config.parameters["date-format"] || "Y/M/D")).join(", "),
            );
        }
    };
};
export default DateTimePicker;
