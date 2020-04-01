import { Button, TextField } from "@material-ui/core";
import AddCommentIcon from "@material-ui/icons/AddComment";
import SendIcon from "@material-ui/icons/Send";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon, ButtonWithProgress } from "../button";
import useUuid from "../util/hooks/useUuid";
import BaseComment from "./BaseComment";

export type NewComment_Props_t = {
    isEditing: boolean
    isSaving: boolean,
    onCreate: () => void,
    onCancel: () => void,
    onSave: (body: string) => void,
};

export default function NewComment(props: NewComment_Props_t) {
    const [newBody, setNewBody] = React.useState("");
    React.useEffect(() => {
        if (!props.isEditing) {
            setNewBody("");
        }
    }, [props.isEditing]);
    const formId = useUuid("comments-NewComment-");

    const { t } = useTranslation("finder-ui");
    if (!props.isEditing) {
        return <ButtonWithIcon
            icon={<AddCommentIcon />}
            color="primary"
            variant="contained"
            onClick={props.onCreate}
        >
            {t("comments/NewComment/create")}
        </ButtonWithIcon>;
    }

    return <BaseComment
        footerAction={
            <NewCommentActions
                isSaving={props.isSaving}
                onSave={() => props.onSave(newBody)}
                onCancel={props.onCancel}
            />
        }
    >
        <TextField
            id={formId}
            label={t("comments/NewComment/comment-label")}
            value={newBody}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewBody(event.target.value)}
            fullWidth
            multiline
            disabled={props.isSaving}
        />
    </BaseComment>;
}

NewComment.propTypes = {
    isSaving: (props: NewComment_Props_t) => {
        if (props.isSaving && !props.isEditing) {
            return new Error("isSaving can not be true when isEditing is false.");
        }
    },
};

type NewCommentActions_Props_t = {
    isSaving: boolean,
    onSave: () => void,
    onCancel: () => void,
    className?: string,
};
function NewCommentActions(props: NewCommentActions_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <>
        <ButtonWithProgress
            icon={<SendIcon />}
            isLoading={props.isSaving}
            variant="contained"
            color="primary"
            onClick={props.onSave}
            className={props.className}
        >
            {t("comments/NewComment/save")}
        </ButtonWithProgress>
        <Button
            disabled={props.isSaving}
            variant="contained"
            onClick={props.onCancel}
            className={props.className}
        >
            {t("comments/NewComment/cancel")}
        </Button>
    </>;
}
