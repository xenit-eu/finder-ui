import { DOM as _, createElement as __ } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { Comment_t, newCommentCard, commentCards } from './comment';

const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

type CommentDialogActions_t = {
    handleClose: () => void
};

function CommentDialogActions({ handleClose }: CommentDialogActions_t) {
    return [
        __(FlatButton, { label: "Close", primary: true, onTouchTap: handleClose })
    ];
}

export type CommentsDialog_t = {
    language: string,
    opened: boolean,
    nbrOfComments: number, // To make React re-render when a deep change took place
    comments: Comment_t[],
    nrOfEditingComments: number, // To make React re-render when a deep change took place
    onClose: () => void,
    onSaveNewComment: (newComment: string) => void,
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void
};

export function CommentsDialog({ language, opened, nbrOfComments, comments, nrOfEditingComments, onClose, onSaveNewComment, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing }: CommentsDialog_t) {
    return __(Dialog, {
        title: "Comments",
        actions: CommentDialogActions({ handleClose: onClose }),
        modal: true,
        open: opened,
        onRequestClose: onClose,
        className: 'comments-dialog',
        bodyClassName: 'comments-content',
        contentStyle: customContentStyle,
        autoScrollBodyContent: true
    }, [
            newCommentCard(onSaveNewComment),
            ...commentCards(language, comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing)
        ]
    );
}
