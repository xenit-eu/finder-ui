import Chip from "@material-ui/core/Chip";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import classnames from "classnames";
import keycode from "keycode";
import React, { cloneElement, KeyboardEvent, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";

/**
 * Data structure for editable chips
 */
export interface IEditableChipData<T> {
    /**
     * Name of the field in the chip
     */
    readonly fieldName: string;

    /**
     * Value of the chip.
     *
     * It can be a single value (when the value key is set) or a value range (when the start and/or end keys are set)
     *
     * For value range, start or end keys can be omitted. In that case, an open-ended range will be displayed and constructed
     */
    readonly fieldValue: Readonly<{ value: T, start?: never, end?: never } | { start: T | null, end: T | null, value?: never }>;
}

export type EditableChip_Props_t<T, D extends IEditableChipData<T>> = {
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
    readonly viewComponent: React.ComponentType<EditableChip_ViewComponent_Props_t<T>>;
    /**
     * Component that will be used to display field values when the chip is in edit-mode
     */
    readonly editComponent?: React.ComponentType<EditableChip_ChangeComponent_Props_t<T>>,
    // @internal for storybook testing only
    readonly _editing?: boolean,
};

type EditableChip_ViewComponent_Props_t<T> = {
    value: T | null,
};

type EditableChip_ChangeComponent_Props_t<T> = {
    value: T | null,
    onChange: (value: T | null) => void,
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

function EditableChip<T, D extends IEditableChipData<T>>(props: EditableChip_Props_t<T, D> & WithStyles<typeof editableChipStyles>) {
    const [isEditing, setEditing] = useState(props._editing ?? false);
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
    if (process.env.NODE_ENV !== "development") {
        invariant(props._editing === undefined, "_editing prop is only allowed for testing.");
    }

    return <Chip
        onDoubleClick={props.onChange && !isEditing ? () => setEditing(true) : undefined}
        onDelete={isEditing && props.onDelete ? undefined : () => props.onDelete!()}
        className={classnames({
            [props.classes.invalidData]: isInvalid(value ?? props.value),
        })}
        label={<>
            <em>{props.value.fieldName}:</em>
            <EditModeChipComponent<T, D>
                value={value ?? props.value}
                onChange={setValue}
                isEditing={isEditing}
                viewComponent={props.viewComponent}
                editComponent={props.editComponent!}
                onCommit={commitEditing}
                onCancel={cancelEditing}
            />
        </>}
        onKeyUp={(ev: KeyboardEvent) => {
            if (keycode.isEventKey(ev.nativeEvent, "esc") && isEditing) {
                cancelEditing();
            } else if (keycode.isEventKey(ev.nativeEvent, "enter") && isEditing) {
                commitEditing();
            } else if (keycode.isEventKey(ev.nativeEvent, "f2") && !isEditing && props.onChange) {
                setEditing(true);
            }
        }}
    />;
}

export default withStyles(editableChipStyles)(EditableChip);

type EditModeChipComponent_Props_t<T, D extends IEditableChipData<T>> = {
    readonly value: D,
    readonly onChange: (value: D) => void,
    readonly onCancel: () => void,
    readonly onCommit: () => void,
    readonly viewComponent: React.ComponentType<EditableChip_ViewComponent_Props_t<T>>;
    readonly editComponent: React.ComponentType<EditableChip_ChangeComponent_Props_t<T>>,
    readonly isEditing: boolean;
};

function EditModeChipComponent<T, D extends IEditableChipData<T>>(props: EditModeChipComponent_Props_t<T, D>) {
    const { t } = useTranslation("finder-ui");
    const isRange = props.value.fieldValue.value === undefined;

    const onKeyUp = useCallback((ev: KeyboardEvent) => {
        if (keycode.isEventKey(ev.nativeEvent, "esc")) {
            props.onCancel();
        }
    }, [props.onCancel]);
    if (!props.isEditing) {
        const ViewComponent = props.viewComponent;
        return isRange ? <>
            <ViewComponent value={props.value.fieldValue.start!} />
            &rarr;
            <ViewComponent value={props.value.fieldValue.end!} />
        </> : <ViewComponent value={props.value.fieldValue.value!} />;
    } else {
        const ChangeComponent = props.editComponent;
        return <>
            {isRange ? <>
                <ChangeComponent
                    value={props.value.fieldValue.start!}
                    onChange={(start: T) => props.onChange({ ...props.value, fieldValue: { start, end: props.value.fieldValue.end! } })}
                    onKeyUp={onKeyUp}
                />
                &rarr;
                <ChangeComponent
                    value={props.value.fieldValue.end!}
                    onChange={(end: T) => props.onChange({ ...props.value, fieldValue: { start: props.value.fieldValue.start!, end } })}
                    onKeyUp={onKeyUp}
                />
            </> : <ChangeComponent
                    value={props.value.fieldValue.value!}
                    onChange={(value: T) => props.onChange({ ...props.value, fieldValue: { value } })}
                    onKeyUp={onKeyUp}
                />}
            <EditModeIconButton onClick={props.onCommit} color={isInvalid(props.value) ? "inherit" : "primary"} disabled={isInvalid(props.value)}>
                <CheckCircleIcon aria-label={t("searchbar/chips/EditableChip/edit-done")} />
            </EditModeIconButton>
            <EditModeIconButton onClick={props.onCancel} color="inherit">
                <CloseIcon aria-label={t("searchbar/chips/EditableChip/edit-cancel")} />
            </EditModeIconButton>
        </>;
    }
}

function isInvalid<T>(chipData: IEditableChipData<T>) {
    const isRange = chipData.fieldValue.value === undefined;

    return isRange ? chipData.fieldValue.end === null && chipData.fieldValue.start === null : chipData.fieldValue.value === null;
}

type EditModeIconButton_Props_t = {
    readonly color?: "primary" | "secondary" | "inherit",
    readonly disabled?: boolean,
    readonly onClick: () => void;
    readonly children: ReactElement;
};

const editModeIconButtonStyles = (theme: Theme) => ({
    root: {
        "WebkitTapHighlightColor": "transparent",
        "color": theme.palette.text.primary,
        "cursor": "pointer",
        "height": "auto",
        "marginLeft": theme.spacing.unit / 2,
        "&:hover, &:focus": {
            color: fade(theme.palette.text.primary, 0.4),
        },
        "&:last-child": {
            marginRight: -theme.spacing.unit,
        },
    },
    rootPrimary: {
        "color": theme.palette.primary.main,
        "&:hover, &:focus": {
            color: fade(theme.palette.primary.main, 0.4),
        },
    },
    rootSecondary: {

        "color": theme.palette.secondary.main,

        "&:hover, &:focus": {
            color: fade(theme.palette.secondary.main, 0.4),
        },
    },
    rootInherit: {
        "color": "inherit",
        "&:hover, &:focus": {
            color: "inherit",
            opacity: 0.9,
        },
    },
    disabled: {
        "cursor": "not-allowed",
        "opacity": 0.5,
        "&:hover, &:focus": {
            color: "unset",
            opacity: 0.5,
        },
    },

});
function EditModeIconButton_(props: EditModeIconButton_Props_t & WithStyles<typeof editModeIconButtonStyles>) {
    const iconChild = React.Children.only(props.children);
    return cloneElement(iconChild, {
        "className": classnames(iconChild.props.className, props.classes.root, {
            [props.classes.rootPrimary]: props.color === "primary",
            [props.classes.rootSecondary]: props.color === "secondary",
            [props.classes.rootInherit]: props.color === "inherit",
            [props.classes.disabled]: props.disabled ?? false,
        }),
        "onClick": props.disabled ? undefined : props.onClick,
        "focusable": !props.disabled,
        "role": "button",
        "aria-hidden": false,
        "aria-disabled": !!props.disabled,
        "tabindex": 0,
    });
}

const EditModeIconButton = withStyles(editModeIconButtonStyles)(EditModeIconButton_);
