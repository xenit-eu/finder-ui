import { Button, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ButtonWithProgress } from "../button";
import useUuid from "../util/hooks/useUuid";
import BaseComment, { IComment } from "./BaseComment";

type EditableComment_Props_t = {
    comment: IComment,
    isSaving: boolean,
    onSave: (body: string) => void,
    onCancel: () => void,
};

export default function EditableComment(props: EditableComment_Props_t) {
    const [newBody, setNewBody] = React.useState(props.comment.body);
    const { t } = useTranslation("finder-ui");
    const formId = useUuid("comments-EditableComment-");
    return <BaseComment
        comment={props.comment}
        footerAction={
            <EditableCommentActions
                isSaving={props.isSaving}
                onSave={() => props.onSave(newBody)}
                onCancel={props.onCancel}
            />
        }
    >
        <TextField
            id={formId}
            label={t("comments/EditableComment/comment-label")}
            value={newBody}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewBody(event.target.value)}
            fullWidth
            multiline
            disabled={props.isSaving}
        />
    </BaseComment>;
}

type EditableCommentActions_Props_t = {
    isSaving: boolean,
    onSave: () => void,
    onCancel: () => void,
    className?: string,
};

function EditableCommentActions(props: EditableCommentActions_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <>
        <ButtonWithProgress
            icon={<SaveIcon />}
            isLoading={props.isSaving}
            variant="contained"
            color="primary"
            onClick={props.onSave}
            className={props.className}
        >
            {t("comments/EditableComment/save")}
        </ButtonWithProgress>
        <Button
            disabled={props.isSaving}
            variant="contained"
            onClick={props.onCancel}
            className={props.className}
        >
            {t("comments/EditableComment/cancel")}
        </Button>
    </>;
}
