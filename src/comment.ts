import { Card, CardTitle } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import TextField from "material-ui/TextField";
import * as moment from "moment";
import { Component, createElement as __, DOM as _ } from "react";

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
    modified: string,
};

declare var require: any;
const calendarTime = (date: string, language?: string, format?: string): string => {
    if (format) {
        return moment(date, format).calendar();
    } else if (language) {
        return moment(date).locale(language).calendar();
    } else {
        return moment(date).calendar();
    }
};

const iconStyle = {
    cursor: "pointer",
};

export type NewCommentCard_t = {
    onSaveNewComment: (newComment: string) => void,
};

export type State_t = {
    newComment: string,
};

export class NewCommentCard extends Component<NewCommentCard_t, State_t> {

    constructor(props: NewCommentCard_t) {
        super(props);
        this.state = {newComment: ""};
    }

    public render () {
        const cardContent = _.div({ className: "comment-card-body" },
            __(CardTitle, {},
                __(TextField, {
                    className: "comment-card-textfield",
                    floatingLabelText: "Add a comment...",
                    hintText: "Add a comment...",
                    onChange: (evt: any) => this.setState({newComment: evt.target.value}),
                    value: this.state.newComment,
                }),
            ),
            _.div({ className: "comment-save-icon" }, __(FontIcon, {
                className: `fa fa-floppy-o`,
                onTouchTap: () => {
                    if (this.state.newComment && this.state.newComment.trim() !== "") {
                        this.props.onSaveNewComment(this.state.newComment.trim());
                        this.setState({newComment: ""});
                    }
                },
                primary: true,
                style: iconStyle,
            })),

        );
        return _.div({ className: "comment-card" }, __(Card, {}, cardContent));
    }
}

export function CommentCards (
    language: string,
    comments: Comment_t[],
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void,
) {
    return comments.map((comment: Comment_t) => {
        let cardText: any;
        if (!comment.editing || !comment.editable) {
            cardText = _.div({ className: "comment-card-body" },
                _.div({ className: "comment-card-title" }, __(CardTitle, {
                    title: comment.comment,
                    subtitle: (comment.authorDisplayName ? comment.authorDisplayName : comment.author)
                                    + " - " + calendarTime(comment.modified, language),
                    style: { "overflow-wrap": "break-word" },
                })),
                comment.editable ?
                    _.div({ className: "comment-delete-icon" }, __(FontIcon, {
                        className: `fa fa-trash`,
                        primary: true,
                        onTouchTap: () => onDeleteComment(comment),
                        style: iconStyle,
                    })) : "",
                comment.editable ?
                    _.div({ className: "comment-edit-icon" }, __(FontIcon, {
                        className: `fa fa-pencil`,
                        primary: true,
                        onTouchTap: () => onStartEditing(comment),
                        style: iconStyle,
                    })) : "",
            );
        } else {
            let backupComment: Comment_t = Object.assign({}, comment);

            cardText = _.div({ className: "comment-card-body" },
                __(CardTitle, {},
                    __(TextField, {
                        className: "comment-card-textfield",
                        onChange: (evt: any) => comment.comment = evt.target.value,
                        defaultValue: comment.comment,
                    }),
                ),
                _.div({ className: "comment-save-icon" }, __(FontIcon, {
                    className: `fa fa-floppy-o`,
                    primary: true,
                    onTouchTap: () => onSaveEditing(comment),
                    style: iconStyle,
                })),
                _.div({ className: "comment-cancel-icon" }, __(FontIcon, {
                    className: `fa fa-ban`,
                    primary: true,
                    onTouchTap: () => {
                        comment.comment = backupComment.comment;
                        onCancelEditing(comment);
                    },
                    style: iconStyle,
                })),

            );
        }
        return _.div({ className: "comment-card" }, __(Card, {}, cardText));
    });
}
