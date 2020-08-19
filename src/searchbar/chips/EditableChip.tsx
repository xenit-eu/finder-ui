import Chip from "@material-ui/core/Chip";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import classnames from "classnames";
import keycode from "keycode";
import React, { cloneElement, KeyboardEvent, ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
export interface IEditableChipData<T> {
    readonly fieldName: string;
    readonly fieldValue: Readonly<{ value: T, start?: never, end?: never } | { start: T, end: T, value?: never }>;
}

type EditableChip_Props_t<T> = {
    readonly value: IEditableChipData<T>,
    readonly onDelete?: () => void,
    readonly onChange?: (value: IEditableChipData<T>) => void,
    readonly viewComponent: React.ComponentType<EditableChip_ViewComponent_Props_t<T>>;
    readonly editComponent?: React.ComponentType<EditableChip_ChangeComponent_Props_t<T>>,
    // @internal for storybook testing only
    readonly _editing?: boolean,
};

type EditableChip_ViewComponent_Props_t<T> = {
    value: T,
};

type EditableChip_ChangeComponent_Props_t<T> = {
    value: T,
    onChange: (value: T) => void,
    onKeyUp: (event: KeyboardEvent) => void,
};

export default function EditableChip<T>(props: EditableChip_Props_t<T>) {
    const [isEditing, setEditing] = useState(props._editing ?? false);
    const [value, setValue] = useState<IEditableChipData<T>|null>(null);
    const cancelEditing = useCallback(() => {
        setValue(null);
        setEditing(false);
    }, [setValue, setEditing]);
    const commitEditing = useCallback(() => {
        props.onChange!(value!);
        cancelEditing();
    }, [props.onChange, value, cancelEditing]);
    return <Chip
        deleteIcon={isEditing ? <DoneIcon /> : <CancelIcon />}
        onDoubleClick={props.onChange && !isEditing ? () => setEditing(true) : undefined}
        onDelete={isEditing ? undefined : props.onDelete}
        label={<>
            <em>{props.value.fieldName}:</em>
            <EditModeChipComponent
                value={value ?? props.value}
                onChange={setValue}
                isEditing={isEditing}
                viewComponent={props.viewComponent}
                editComponent={props.editComponent!}
                onCommit={commitEditing}
                onCancel={cancelEditing}
            />
        </>}
        onKeyUp={isEditing ? (ev: KeyboardEvent) => {
            if (keycode.isEventKey(ev.nativeEvent, "esc")) {
                cancelEditing();
            } else if (keycode.isEventKey(ev.nativeEvent, "enter")) {
                commitEditing();
            }
        } : undefined}
    />;
}

type EditModeChipComponent_Props_t<T> = {
    readonly value: IEditableChipData<T>,
    readonly onChange: (value: IEditableChipData<T>) => void,
    readonly onCancel: () => void,
    readonly onCommit: () => void,
    readonly viewComponent: React.ComponentType<EditableChip_ViewComponent_Props_t<T>>;
    readonly editComponent: React.ComponentType<EditableChip_ChangeComponent_Props_t<T>>,
    readonly isEditing: boolean;
};

function EditModeChipComponent<T>(props: EditModeChipComponent_Props_t<T>) {
    const isRange = !props.value.fieldValue.value;
    if (!props.isEditing) {
        const ViewComponent = props.viewComponent;
        return isRange ? <>
            <ViewComponent value={props.value.fieldValue.start!} />
            &rarr;
            <ViewComponent value={props.value.fieldValue.end!} />
        </> : <ViewComponent value={props.value.fieldValue.value!} />;
    } else {
        const onKeyUp = useCallback((ev: KeyboardEvent) => {
            if (keycode.isEventKey(ev.nativeEvent, "esc")) {
                props.onCancel();
            }
        }, [props.onCancel]);
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
            <EditModeIconButton onClick={props.onCommit}>
                <DoneIcon />
            </EditModeIconButton>
            <EditModeIconButton onClick={props.onCancel}>
                <CancelIcon />
            </EditModeIconButton>
        </>;
    }
}

type EditModeIconButton_Props_t = {
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
        "&:hover": {
            color: fade(theme.palette.text.primary, 0.4),
        },
        "&:last-child": {
            marginRight: -theme.spacing.unit,
        },
    },

});
function EditModeIconButton_(props: EditModeIconButton_Props_t & WithStyles<typeof editModeIconButtonStyles>) {
    const iconChild = React.Children.only(props.children);
    return cloneElement(iconChild, {
        className: classnames(iconChild.props.className, props.classes.root),
        onClick: props.onClick,
    });
}

const EditModeIconButton = withStyles(editModeIconButtonStyles)(EditModeIconButton_);
