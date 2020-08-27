import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import classnames from "classnames";
import React, { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import FieldRenderer, {FieldRendererComponent, ISearchboxFieldData, isEmptyValue, isRange} from "../FieldRenderer";
import ChipIconButton from "./ChipIconButton";
import ResizableChip from "./ResizableChip";
import useKeypressHandler from "./useKeypressHandler";

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
     * Function that is called when the chip data is changed
     */
    readonly onChange?: (value: D) => void,
    /**
     * Component that will be used to display field values when the chip is in view-mode
     */
    readonly viewComponent: FieldRendererComponent<T, {}>;
    /**
     * Component that will be used to display field values when the chip is in edit-mode
     */
    readonly editComponent?: FieldRendererComponent<T, EditableChip_ChangeComponent_Props_t>,

    /**
     * Component is in edit mode
     *
     * If this is true, {@link onChange} and {@link editComponent} must be present as well.
     */
    readonly editing: boolean,

    /**
     * Function that is called when editing is initiated
     */
    readonly onBeginEditing?: () => void,

    /**
     * Function that is called when editing is cancelled
     */
    readonly onCancelEditing?: () => void,

    /**
     * Function that is called when editing is committed
     */
    readonly onCommitEditing?: () => void,
};

type EditableChip_ChangeComponent_Props_t = {
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

    if (props.editing) {
        invariant(props.editComponent, "editComponent is required when editing is set.");
        invariant(props.onChange, "onChange is required when editing is set.");
    }

    invariant(!isEmptyValue(props.value.fieldValue), "value.fieldValue can not be an empty value.");

    const handlers = {
        onExit: props.editing ? props.onCancelEditing : undefined,
        onCommit: props.editing ? (isInvalid(props.value) ? () => { } : props.onCommitEditing) : undefined,
        onModify: !props.editing ? props.onBeginEditing : undefined,
    };

    const keyUp = useKeypressHandler(handlers);

    return <ResizableChip
        onDoubleClick={handlers.onModify}
        onDelete={props.editing ? undefined : props.onDelete}
        className={classnames({
            [props.classes.invalidData]: isInvalid(props.value),
        })}
        label={<EditModeChipComponent<T, D>
            value={props.value}
            onChange={props.onChange!}
            isEditing={props.editing}
            viewComponent={props.viewComponent}
            editComponent={props.editComponent!}
            onCommit={handlers.onCommit}
            onCancel={handlers.onExit}
        />}
        onKeyUp={keyUp}
    />;
}

export default withStyles(editableChipStyles)(EditableChip);

type EditModeChipComponent_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly onChange: (value: D) => void,
    readonly onCancel?: () => void,
    readonly onCommit?: () => void,
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
            {props.onCommit && <ChipIconButton onClick={() => props.onCommit!()} color={isInvalid(props.value) ? "inherit" : "primary"} disabled={isInvalid(props.value)}>
                <CheckCircleIcon aria-label={t("searchbar/chips/EditableChip/edit-done")} />
            </ChipIconButton>}
            {props.onCancel && <ChipIconButton onClick={() => props.onCancel!()} color="inherit">
                <CloseIcon aria-label={t("searchbar/chips/EditableChip/edit-cancel")} />
            </ChipIconButton>}
        </>;
    }
}

function isInvalid<T>(chipData: ISearchboxFieldData<T>) {
    invariant(!isEmptyValue(chipData.fieldValue), "chipData.fieldValue can not be an empty value.");
    return isRange(chipData.fieldValue) ? chipData.fieldValue.end === null && chipData.fieldValue.start === null : chipData.fieldValue.value === null;
}
