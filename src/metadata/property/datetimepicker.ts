import * as debug from "debug";
import DatePicker from "material-ui/DatePicker";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";
const d = debug("finder-ui:metadata:property:datetimepicker");

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const DateTimePicker: PropertyRenderer_t<Date> = (config: PropertyRenderConfig_t<Date>) => {
    // tslint:disable-next-line:only-arrow-functions
    return function DateTimePicker(props: FieldSkeleton_Props_t) {
        const defaultValueString = config.parameters["override-default-value"] || null;
        let defaultValue = undefined;
        if(defaultValueString) {
            if(defaultValueString === "today") {
                defaultValue = new Date();
            } else {
                try {
                    defaultValue = new Date(Date.parse(defaultValueString));
                } catch(e) {
                    d("Can not parse default value %s to date: %O", defaultValueString, e);
                }
            }
        }

        if (props.renderMode !== RenderMode.VIEW) {
            return _.span({ className: "metadata-field" }, __(DatePicker, {
                fullWidth: true,
                autoOk: true,
                container: "inline",
                hintText: "Pick a date",
                onChange: (evt: FormEvent<{}>, value: Date) => {
                    props.onChange(config.mapToModel(props.node, value));
                },
                defaultDate: defaultValue,
                value: config.mapToView(props.node),
            }));
        } else {
            const viewValue = config.mapToView(props.node);
            return _.span({ className: "metadata-value" }, viewValue ? viewValue.toString() : "");
        }
    };
};
export default DateTimePicker;
