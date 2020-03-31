import { action } from "@storybook/addon-actions";
import * as React from "react";
import Comment from "./Comment";

export default {
    title: "comments/Comment",
    component: Comment,
};

export const withoutModify = () => <Comment comment={{
    author: "C. Norris",
    date: new Date("2020-04-01T00:00:00.000Z"),
    body: "Once a police officer caught Chuck Norris, the cop was lucky enough to escape with a warning.",
}} />;

export const withEdit = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't bug hunt as that signifies a probability of failure, he goes bug killing.",
    }}
    onEdit={action("edit")}
/>;

export const withDelete = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants.",
    }}
    onDelete={action("delete")}
/>;

export const withEditAndDelete = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants.",
    }}
    onEdit={action("edit")}
    onDelete={action("delete")}
/>;
