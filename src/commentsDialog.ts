import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { createElement as __ } from "react";
import * as _ from "react-dom-factories";

import { Comment_t, CommentCards, NewCommentCard } from "./comment";

const customContentStyle = {
    width: "90%",
    maxWidth: "none",
};

type CommentDialogActions_t = {
    handleClose: () => void;
};

function CommentDialogActions({ handleClose }: CommentDialogActions_t) {
    return [
        __(FlatButton, { label: "Close", primary: true, onClick: handleClose }),
    ];
}

export type CommentsDialog_t = {
    language: string,
    opened: boolean,
    comments: Comment_t[],
    onClose: () => void,
    onSaveNewComment: (newComment: string) => void,
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void,
};

export function CommentsDialog({ language, opened, comments, onClose, onSaveNewComment,
    onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing }: CommentsDialog_t) {
    return __(Dialog, {
        title: "Comments",
        actions: CommentDialogActions({ handleClose: onClose }),
        modal: true,
        open: opened,
        onRequestClose: onClose,
        className: "comments-dialog",
        bodyClassName: "comments-content",
        contentStyle: customContentStyle,
        autoScrollBodyContent: true,
    }, [
            __(NewCommentCard, { onSaveNewComment, key: "newComment" }),
            ...CommentCards(language, comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing),
        ],
    );
}
