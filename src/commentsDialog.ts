import { DOM as _, createElement as __ } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardTitle } from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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

export type Comment_t = {
    nodeRef: string,
    parentNodeRef: string,
    author: string,
    authorDisplayName: string,
    editing: boolean,
    title: string,
    comment: string,
    created: string,
    modified: string
};

export function CommentsDialog({ opened, nbrOfComments, comments, nrOfEditingComments, onClose, onSaveNewComment, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing }: CommentsDialog_t) {
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
            ...commentCards(comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing)
        ]
    );
}

export function newCommentCard(onSaveNewComment: (newComment: string) => void) {
    let newComment: string;

    let cardText = _.div({ className: "comment-card-body" },
        __(CardTitle, {},
            __(TextField, {
                className: "comment-card-textfield",
                hintText: "Add a comment...",
                floatingLabelText: "Add a comment...",
                onChange: (evt: any) => newComment = evt.target.value
            }),
        ),
        _.div({ className: "comment-save-icon" }, __(FontIcon, {
            className: `fa fa-floppy-o`,
            primary: true,
            onTouchTap: () => {
                if (newComment && newComment.trim() !== "")
                    onSaveNewComment(newComment.trim());
            },
            style: iconStyle
        }))

    )
    return _.div({ className: 'comment-card' }, __(Card, {}, cardText)
    );
}

export function commentCards(
    comments: Comment_t[],
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (backupComment: Comment_t, updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void
) {
    return comments.map((comment: Comment_t) => {
        let cardText: any;
        if (!comment.editing) {
            cardText = _.div({ className: "comment-card-body" },
                _.div({ className: "comment-card-title" }, __(CardTitle, {
                    title: comment.comment,
                    subtitle: comment.author + " - " + comment.modified, // TODO format datetime
                    style: { "overflow-wrap": "break-word" }
                })),
                _.div({ className: "comment-delete-icon" }, __(FontIcon, {
                    className: `fa fa-trash`,
                    primary: true,
                    onTouchTap: () => onDeleteComment(comment),
                    style: iconStyle
                })),
                _.div({ className: "comment-edit-icon" }, __(FontIcon, {
                    className: `fa fa-pencil`,
                    primary: true,
                    onTouchTap: () => onStartEditing(comment),
                    style: iconStyle
                }))
            )
        } else {
            let backupComment: Comment_t = Object.assign({}, comment);


            cardText = _.div({ className: "comment-card-body" },
                __(CardTitle, {},
                    __(TextField, {
                        className: "comment-card-textfield",
                        onChange: (evt: any) => comment.comment = evt.target.value,
                        defaultValue: comment.comment
                    }),
                ),
                _.div({ className: "comment-save-icon" }, __(FontIcon, {
                    className: `fa fa-floppy-o`,
                    primary: true,
                    onTouchTap: () => onSaveEditing(backupComment, comment),
                    style: iconStyle
                })),
                _.div({ className: "comment-cancel-icon" }, __(FontIcon, {
                    className: `fa fa-ban`,
                    primary: true,
                    onTouchTap: () => {
                        comment.comment = backupComment.comment;
                        onCancelEditing(comment)
                    },
                    style: iconStyle
                }))

            )
        }
        return _.div({ className: 'comment-card' }, __(Card, {}, cardText));
    })
}

const iconStyle = {
    cursor: "pointer"
}

