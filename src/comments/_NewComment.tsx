import { Button } from "@material-ui/core";
import AddCommentIcon from "@material-ui/icons/AddComment";
import SendIcon from "@material-ui/icons/Send";
import * as React from "react";
import { useTranslation } from "react-i18next";
import RichTextEditor from "react-rte";
import { ButtonWithIcon, ButtonWithProgress } from "../button";
import BaseComment from "./_BaseComment";
import { toolbarConfig } from "./_RichTextEditorConfig";

export type NewComment_Props_t = {
    isEditing: boolean
    isSaving: boolean,
    onCreate: () => void,
    onCancel: () => void,
    onSave: (body: string) => void,
};

export default function NewComment(props: NewComment_Props_t) {
    const [newBody, setNewBody] = React.useState(() => RichTextEditor.createEmptyValue());
    React.useEffect(() => {
        if (!props.isEditing) {
            setNewBody(RichTextEditor.createEmptyValue());
        }
    }, [props.isEditing]);
    const commentRef = React.useRef<HTMLDivElement | null>(null);
    React.useLayoutEffect(() => {
        if (props.isEditing) {
            commentRef.current?.scrollIntoView(false);
        }
    }, [commentRef, props.isEditing]);

    const { t } = useTranslation("finder-ui");
    if (!props.isEditing) {
        return <ButtonWithIcon
            icon={<AddCommentIcon />}
            color="primary"
            variant="contained"
            onClick={() => props.onCreate()}
        >
            {t("comments/NewComment/create")}
        </ButtonWithIcon>;
    }

    return <div ref={commentRef}>
        <BaseComment
            footerAction={
                <NewCommentActions
                    isSaving={props.isSaving}
                    onSave={() => props.onSave(newBody.toString("html"))}
                    onCancel={() => props.onCancel()}
                />
            }
        >
            <RichTextEditor
                value={newBody}
                onChange={setNewBody}
                readOnly={props.isSaving}
                toolbarConfig={toolbarConfig}
                autoFocus
            />
        </BaseComment>
    </div>;
}

NewComment.propTypes = {
    isSaving: (props: NewComment_Props_t) => {
        if (props.isSaving && !props.isEditing) {
            return new Error("isSaving can not be true when isEditing is false.");
        }
        return null;
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
