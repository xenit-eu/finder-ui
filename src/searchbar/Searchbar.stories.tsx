import { IconButton } from "@material-ui/core";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import SearchIcon from "@material-ui/icons/Search";
import { action } from "@storybook/addon-actions";
import React from "react";
import { ButtonWithIcon } from "../button";
import EditableChip from "./chips/EditableChip";
import TextComponent from "./renderer/Text";
import Searchbar from "./Searchbar";

export default {
    title: "searchbar/Searchbar",
    component: Searchbar,
};

const SomeEditableChip = (props) => <EditableChip
    viewComponent={TextComponent}
    editComponent={TextComponent}
    onBeginEditing={action("beginEditing")}
    onCommitEditing={action("commitEditing")}
    onCancelEditing={action("cancelEditing")}
    editing={false}
    value={{
        fieldName: "Some field",
        fieldValue: { value: Array(props.i ?? 3).fill("a").join("") },
    }}
/>;
const actions = <>
    <IconButton color="primary">
        <SearchIcon />
    </IconButton>
    <IconButton>
        <BookmarkBorderIcon />
    </IconButton>
</>;

export const editing = () => <div style={{ backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Some typed in value" onChange={action("change")} editing={true} actions={actions}>
        <SomeEditableChip />
        <SomeEditableChip />
    </Searchbar>
</div>;

export const notEditing = () => <div style={{ backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Some typed in value" onChange={action("change")} editing={false} actions={actions}>
        <SomeEditableChip />
        <SomeEditableChip />
    </Searchbar>
</div>;

export const manyChips = () => <div style={{ width: 600, backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Input value" onChange={action("change")} editing={true} actions={actions}>
        {Array(15).fill(null).map((_, i) => <SomeEditableChip key={i} i={i} />)}
    </Searchbar>
</div>;
