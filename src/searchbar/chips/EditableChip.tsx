import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import classnames from "classnames";
import React, { KeyboardEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import FieldRenderer, {FieldRendererComponent, ISearchboxFieldData, isEmptyValue, isRange} from "../FieldRenderer";
import ChipIconButton from "./ChipIconButton";
import ResizableChip from "./ResizableChip";
import useKeypressHandler from "./useKeypressHandler";

// @internal
// tslint:disable-next-line
export const _editing = Symbol();

export type EditableChip_Props_t<T, D extends ISearchboxFieldData<T>> = {
    /**
     * Current chip data to show
     */
    readonly value: D,
    /**
     * Function that will be called when the chip is deleted.
     * If this function is not present, no delete button will be shown
     */
    readonly onDelete?: () => void,
    /**
     * Function that is called when the chip has been edited.
     * If this function is not present, the chip will not be editable.
     *
     * If this function is present, {@link editComponent} must be present as well.
     */
    readonly onChange?: (value: D) => void,
    /**
     * Component that will be used to display field values when the chip is in view-mode
     */
    readonly viewComponent: FieldRendererComponent<T, {}>;
    /**
     * Component that will be used to display field values when the chip is in edit-mode
     */
    readonly editComponent?: FieldRendererComponent<T, EditableChip_ChangeComponent_Props_t<T>>,
    // @internal for storybook testing only
    readonly _editing?: typeof _editing,
};

type EditableChip_ChangeComponent_Props_t<T> = {
    onKeyUp: (event: KeyboardEvent) => void,
};

const editableChipStyles = (theme: Theme) => ({
    invalidData: {
        "backgroundColor": theme.palette.error.main,
        "color": theme.palette.error.contrastText,
        "&:hover, &:focus": {
            backgroundColor: emphasize(theme.palette.error.main, 0.08),
        },
        "&:active": {
            backgroundColor: emphasize(theme.palette.error.main, 0.12),
        },
    },
});

function EditableChip<T, D extends ISearchboxFieldData<T>>(props: EditableChip_Props_t<T, D> & WithStyles<typeof editableChipStyles>) {
    const [isEditing, setEditing] = useState(props._editing ? true : false);
    const [value, setValue] = useState<D|null>(null);
    const cancelEditing = useCallback(() => {
        setValue(null);
        setEditing(false);
    }, [setValue, setEditing]);
    const commitEditing = useCallback(() => {
        const finalValue = value ?? props.value;
        if (!isInvalid(finalValue)) {
            props.onChange!(finalValue);
            cancelEditing();
        }
    }, [props.onChange, value, props.value, cancelEditing]);

    if (props.onChange) {
        invariant(props.editComponent, "editComponent is required when onChange is set.");
    }
    if (props._editing) {
        invariant(props._editing === _editing, "_editing is internal, only to be used in storybook.");

    }
    invariant(!isEmptyValue(props.value.fieldValue), "value.fieldValue can not be an empty value.");

    const keyUp = useKeypressHandler({
        onExit: () => isEditing && cancelEditing(),
        onCommit: () => isEditing && commitEditing(),
        onModify: () => !isEditing && props.onChange && setEditing(true),
    });

    return <ResizableChip
        onDoubleClick={props.onChange && !isEditing ? () => setEditing(true) : undefined}
        onDelete={isEditing || !props.onDelete ? undefined : () => props.onDelete!()}
        className={classnames({
            [props.classes.invalidData]: isInvalid(value ?? props.value),
        })}
        label={<EditModeChipComponent<T, D>
                value={value ?? props.value}
                onChange={setValue}
                isEditing={isEditing}
                viewComponent={props.viewComponent}
                editComponent={props.editComponent!}
                onCommit={commitEditing}
                onCancel={cancelEditing}
            />}
        onKeyUp={keyUp}
    />;
}

export default withStyles(editableChipStyles)(EditableChip);

type EditModeChipComponent_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly onChange: (value: D) => void,
    readonly onCancel: () => void,
    readonly onCommit: () => void,
    readonly viewComponent: FieldRendererComponent<T, {}>,
    readonly editComponent: FieldRendererComponent<T, EditableChip_ChangeComponent_Props_t<T>>,
    readonly isEditing: boolean;
};

function EditModeChipComponent<T, D extends ISearchboxFieldData<T>>(props: EditModeChipComponent_Props_t<T, D>) {
    const { t } = useTranslation("finder-ui");

    const onKeyUp = useKeypressHandler({
        onExit: props.onCancel,
    });
    if (!props.isEditing) {
        return <FieldRenderer data={props.value} component={props.viewComponent} componentProps={{}} />;
    } else {
        return <>
            <FieldRenderer
                data={props.value}
                onChange={props.onChange}
                component={props.editComponent}
                componentProps={{ onKeyUp }}
            />
            <ChipIconButton onClick={props.onCommit} color={isInvalid(props.value) ? "inherit" : "primary"} disabled={isInvalid(props.value)}>
                <CheckCircleIcon aria-label={t("searchbar/chips/EditableChip/edit-done")} />
            </ChipIconButton>
            <ChipIconButton onClick={props.onCancel} color="inherit">
                <CloseIcon aria-label={t("searchbar/chips/EditableChip/edit-cancel")} />
            </ChipIconButton>
        </>;
    }
}

function isInvalid<T>(chipData: ISearchboxFieldData<T>) {
    invariant(!isEmptyValue(chipData.fieldValue), "chipData.fieldValue can not be an empty value.");
    return isRange(chipData.fieldValue) ? chipData.fieldValue.end === null && chipData.fieldValue.start === null : chipData.fieldValue.value === null;
}
