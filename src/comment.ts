import { DOM as _, createElement as __ } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardTitle } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

export type Comment_t = {
    nodeRef: string,
    parentNodeRef: string,
    author: string,
    authorDisplayName: string,
    editable: boolean,
    editing: boolean,
    title: string,
    comment: string,
    created: string,
    modified: string
};

declare var require: any
var moment = require('moment');
const calendarTime = (date: string, language?: string, format?: string): string => {
    if (format) return moment(date, format).calendar();
    else if (language) return moment(date).lang(language).calendar();
    else return moment(date).calendar();
}

const iconStyle = {
    cursor: "pointer"
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
    language: string,
    comments: Comment_t[],
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (backupComment: Comment_t, updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void
) {
    return comments.map((comment: Comment_t) => {
        let cardText: any;
        if (!comment.editing || !comment.editable) {
            cardText = _.div({ className: "comment-card-body" },
                _.div({ className: "comment-card-title" }, __(CardTitle, {
                    title: comment.comment,
                    subtitle: comment.author + " - " + calendarTime(comment.modified, language),
                    style: { "overflow-wrap": "break-word" }
                })),
                comment.editable ?
                    _.div({ className: "comment-delete-icon" }, __(FontIcon, {
                        className: `fa fa-trash`,
                        primary: true,
                        onTouchTap: () => onDeleteComment(comment),
                        style: iconStyle
                    })) : "",
                comment.editable ?
                    _.div({ className: "comment-edit-icon" }, __(FontIcon, {
                        className: `fa fa-pencil`,
                        primary: true,
                        onTouchTap: () => onStartEditing(comment),
                        style: iconStyle,
                    })) : "",
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
