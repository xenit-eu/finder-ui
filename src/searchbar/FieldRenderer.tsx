import React from "react";

import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

/**
 * Data structure for fields
 * @template T data-type of the field value
 */
export interface ISearchboxFieldData<T> {
    /**
     * Name of the field in the chip
     */
    readonly fieldName: string;

    /**
     * Value of the field.
     *
     * It can be a single value (when the value key is set) or a value range (when the start and/or end keys are set)
     *
     * For value range, start or end keys can be omitted. In that case, an open-ended range will be displayed and constructed
     */
    readonly fieldValue: ISearchboxFieldDataSingleValue<T> | ISearchboxFieldDataRangeValue<T>;
}

interface ISearchboxFieldDataSingleValue<T> {
    readonly value: T;
}
interface ISearchboxFieldDataRangeValue<T> {
    readonly start: T | null;
    readonly end: T | null;
}

export type FieldRendererComponentProps<T, ComponentProps> = AutocompleteListEntry_ViewComponent_Props_t<T> & ComponentProps;

/**
 * A react component that is used to render field values
 * @template T data-type that the component renders
 * @template ComponentProps Additional, shared properties that are passed to the renderer
 */
export type FieldRendererComponent<T, ComponentProps> = React.ComponentType<FieldRendererComponentProps<T, ComponentProps>>;

/**
 * Properties for the field renderer
 * @template T data-type of the field value
 * @template D data-type that is provided to this component (additional data can be stored and retrieved from it)
 * @template ComponentProps Additional, shared properties that are passed to the renderer component
 */
type FieldRenderer_Props_t<T, D extends ISearchboxFieldData<T>, ComponentProps> = {
    readonly data: D,
    readonly onChange?: (newData: D) => void,
    readonly component: FieldRendererComponent<T, ComponentProps>,
    readonly componentProps: ComponentProps,
};

type AutocompleteListEntry_ViewComponent_Props_t<T> = {
    readonly value: T | null,
    readonly onChange?: (newValue: T | null) => void,
};

/**
 * Checks if a field value is a range value
 * @internal
 * @param item The field value to check
 */
export function isRange<T>(item: ISearchboxFieldDataSingleValue<T> | ISearchboxFieldDataRangeValue<T>): item is ISearchboxFieldDataRangeValue<T> {
    return (item as any).value === undefined;
}

/**
 * @internal
 */
export default function FieldRenderer<T, D extends ISearchboxFieldData<T>, ComponentProps>(props: FieldRenderer_Props_t<T, D, ComponentProps>) {

    function createOnChange(prop: "start"|"end"|"value") {
        if (!props.onChange) {
            return undefined;
        }

        return (value: T) => props.onChange!({
            ...props.data,
            fieldValue: {
                ...props.data.fieldValue,
                [prop]: value,
            },
        });
    }

    return <>
        <em>{props.data.fieldName}:</em>&nbsp;
        {isRange(props.data.fieldValue) ? <>
            <props.component {...props.componentProps} value={props.data.fieldValue.start} onChange={createOnChange("start")} />
            &nbsp;
            <ArrowRightAltIcon fontSize="inherit" />
            &nbsp;
            <props.component {...props.componentProps} value={props.data.fieldValue.end} onChange={createOnChange("end")} />
        </> :
            <props.component {...props.componentProps} value={props.data.fieldValue.value} onChange={createOnChange("value")} />
        }
    </>;
}
