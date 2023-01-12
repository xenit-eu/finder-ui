import MomentUtils from "@date-io/moment";
import { Chip, IconButton, List } from "@material-ui/core";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import SearchIcon from "@material-ui/icons/Search";
import { action } from "@storybook/addon-actions";
import keycode from "keycode";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import React, { useReducer, useState } from "react";
import AutocompleteChip from "./autocomplete/AutocompleteChip";
import AutocompleteChips from "./autocomplete/AutocompleteChips";
import CompositeChip from "./chips/CompositeChip";
import AutocompleteListEntry from "./autocomplete/AutocompleteListEntry";
import AutocompletePaper from "./autocomplete/AutocompletePaper";
import EditableChip from "./chips/EditableChip";
import DateOrText from "./renderer/DateOrText";
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

const SomeBigCompositeEditableChip = (props) => <CompositeChip onDelete={action("delete")}>
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
OR
<SomeEditableChip/>
</CompositeChip>;

const BigEditableChip = (props) => <EditableChip
    viewComponent={TextComponent}
    editComponent={TextComponent}
    onBeginEditing={action("beginEditing")}
    onCommitEditing={action("commitEditing")}
    onCancelEditing={action("cancelEditing")}
    editing={false}
    value={{
        fieldName: "Some field",
        fieldValue: { value: Array(500).fill("a").join("") },
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
    <Searchbar value="Some typed in value" onChange={action("change")} onKeyDown={action("keyDown")} editing={true} actions={actions}>
        <SomeEditableChip />
        <SomeEditableChip />
    </Searchbar>
</div>;

export const emptySearchbar = () => <div style={{ backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="" onChange={action("change")} onKeyDown={action("keyDown")} editing={true} actions={actions}>
        <SomeEditableChip />
        <SomeEditableChip />
    </Searchbar>
</div>;

export const notEditing = () => <div style={{ backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Some typed in value" onChange={action("change")} onKeyDown={action("keyDown")} editing={false} actions={actions}>
        <SomeEditableChip />
        <SomeEditableChip />
    </Searchbar>
</div>;

export const manyChips = () => <div style={{ width: 600, backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Input value" onChange={action("change")} onKeyDown={action("keyDown")} editing={true} actions={actions}>
        {Array(15).fill(null).map((_, i) => <SomeEditableChip key={i} i={i} />)}
    </Searchbar>
</div>;

export const compositeChipsWithManyChips = () => <div style={{ width: 600, backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Input value" onChange={action("change")} onKeyDown={action("keyDown")} editing={true} actions={actions}>
        {Array(1).fill(null).map((_, i) => <SomeBigCompositeEditableChip key={i} i={i} />)}
    </Searchbar>
</div>;

export const veryBigChip = () => <div style={{ width: 600, backgroundColor: "hotpink", padding: 25 }}>
    <Searchbar value="Input value" onChange={action("change")} onKeyDown={action("keyDown")} editing={true} actions={actions}>
        {Array(1).fill(null).map((_, i) => <BigEditableChip key={i} i={i} />)}
        <SomeEditableChip/>
        <SomeBigCompositeEditableChip/>
    </Searchbar>
</div>;

function FullSearchbar() {

    const [state, updateState] = useReducer((s, action) => {
        const event: KeyboardEvent = action.event?.nativeEvent;
        event?.stopPropagation();
        switch (action.type) {
            case "input-change":
                return {
                    ...s,
                    inputText: action.value,
                    autocompleteOpen: action.value.length > 0,
                };
            case "input-keypress":
                if (keycode.isEventKey(event, "esc")) {
                    return {
                        ...s,
                        autocompleteOpen: false,
                    };
                } else if (keycode.isEventKey(event, "tab") || keycode.isEventKey(event, "down")) {
                    return {
                        ...s,
                        autocompleteOpen: true,
                    };
                } else if (keycode.isEventKey(event, "up")) {
                    return {
                        ...s,
                    };
                }
                break;
            case "autocomplete-close":
                return {
                    ...s,
                    autocompleteOpen: false,
                };
            case "autocomplete-select":
                return {
                    ...s,
                    autocompleteOpen: false,
                    inputText: "",
                    chips: s.chips.concat([action.chip]),
                };
            default:
                return s;
        }
        return s;
    }, {
        autocompleteOpen: false,
        inputText: "",
        chips: [],
    });

    const searchbar = <Searchbar
        value={state.inputText}
        editing
        onChange={(value) => updateState({ type: "input-change", value })}
        onKeyDown={(e) => {
            e.persist();
            updateState({ type: "input-keypress", event: e });
        }}
    >
        {state.chips.map((c, i) => <Chip
            key={i}
            label={c}
            clickable
            />)}
    </Searchbar>;

    return <AutocompletePaper target={searchbar} open={state.autocompleteOpen} onDismiss={() => updateState({ type: "autocomplete-close" })}>
        <AutocompleteChips>
            <AutocompleteChip customText="BLABLA" viewComponent={TextComponent} value={null} onSelect={() => updateState({ type: "autocomplete-select", chip: "BLABLA" })} />
            <AutocompleteChip customText="BLIBLIBLI" viewComponent={TextComponent} value={null} onSelect={() => updateState({ type: "autocomplete-select", chip: "BLIBLIBLI" })} />
        </AutocompleteChips>
        <List>
            <AutocompleteListEntry value={{
                fieldName: "Some field",
                fieldValue: { value: "abc" },
            }} viewComponent={TextComponent} onSelect={() => {
                updateState({
                    type: "autocomplete-select",
                    chip: "Some field: abc",
                });
            }} />

        </List>

    </AutocompletePaper>;
}

export const fullSearchbar = () => <div style={{ backgroundColor: "hotpink", padding: 25, height: "100vh" }}>
    <FullSearchbar />
    {new Array(10).fill(0).map((_, i) => <p key={i}>
        <a href="#" onClick={() => { throw new Error("Should not be clicked!"); }}>Some clickey bits</a>
    </p>)}
</div>;

fullSearchbar.parameters = {
    storyshots: {
        disable: true,
    },
};

export const searchbarWithDateChip = () => <MuiPickersUtilsProvider utils={MomentUtils}>
    <AutocompletePaper
        target={<Searchbar editing={false} value="" onChange={action("change")}>
            <EditableChip
                editing
                viewComponent={DateOrText}
                editComponent={DateOrText}
                value={{
                    fieldName: "Test Date field",
                    fieldValue: {
                        value: "some text",
                    },

                }}
                onChange={action("change")}
            />
        </Searchbar>}
        open={true}
        onDismiss={action("dismiss")}>
        <List>
            <AutocompleteListEntry value={{
                fieldName: "Some field",
                fieldValue: { value: "abc" },
            }} viewComponent={TextComponent} onSelect={action("select")} />

        </List>

    </AutocompletePaper>
</MuiPickersUtilsProvider>;

searchbarWithDateChip.parameters = {
    storyshots: {
        disable: true,
    },
};
