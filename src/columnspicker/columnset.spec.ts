import { Button, Select } from "@material-ui/core";
import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { createElement as __ } from "react";
import ColumnSet from "./columnset";

configure({ adapter: new Adapter() });

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

describe("ColumnsPicker: ColumnSet", () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it("Works when no column sets are availble", () => {
        const props = {
            columnSets: [],
            currentSet: null,
            currentColumns: [],
            onSelect: () => { },
            onCreate: () => { },
            onDelete: () => { },
        };

        const component = mount(__(ColumnSet, props));

        const selectField = component.find(Select);

        expect(selectField).toHaveProp("value", "");
        expect(selectField).toHaveText("(None)");

        const buttons = component.find(Button);

        expect(buttons.at(0)).toBeDisabled(); // Save
        expect(buttons.at(1)).not.toBeDisabled(); // Save as
        expect(buttons.at(2)).toBeDisabled(); // Delete
    });

    const columnSets = [
        {
            id: "abc",
            label: "ABC",
            columns: ["a", "b", "c"],
        },
        {
            id: "cde",
            label: "CDE",
            columns: ["c", "d", "e"],
        },
        {
            id: "readonly",
            label: "RO",
            columns: ["a", "d", "e", "f"],
            readonly: true,
        },
    ];

    it("Shows available column sets", () => {
        const props = {
            columnSets,
            currentSet: "cde",
            currentColumns: ["c", "d", "e"],
            onSelect: () => { },
            onCreate: () => { },
            onDelete: () => { },
        };

        const component = mount(__(ColumnSet, props));

        {
            const selectField = component.find(Select);
            expect(selectField).toHaveProp("value", "cde");
            expect(selectField).toHaveText("CDE");

            const buttons = component.find(Button);

            expect(buttons.at(0)).not.toBeDisabled(); // Save
            expect(buttons.at(1)).not.toBeDisabled(); // Save as
            expect(buttons.at(2)).not.toBeDisabled(); // Delete
        }

        {
            component.setProps({
                currentColumns: ["c", "d"],
            });
            const selectField = component.find(Select);
            expect(selectField).toHaveText("CDE*");

            const buttons = component.find(Button);
            expect(buttons.at(0)).not.toBeDisabled(); // Save
            expect(buttons.at(1)).not.toBeDisabled(); // Save as
            expect(buttons.at(2)).not.toBeDisabled(); // Delete
        }

        {
            component.setProps({
                currentSet: "readonly",
                currentColumns: ["a", "d", "e", "f"],
            });

            const selectField = component.find(Select);
            expect(selectField).toHaveText("RO");

            const buttons = component.find(Button);
            expect(buttons.at(0)).toBeDisabled(); // Save
            expect(buttons.at(1)).not.toBeDisabled(); // Save as
            expect(buttons.at(2)).toBeDisabled(); // Delete
        }

        {
            component.setProps({
                currentColumns: ["c", "d"],
            });

            const selectField = component.find(Select);
            expect(selectField).toHaveText("RO*");

            const buttons = component.find(Button);
            expect(buttons.at(0)).toBeDisabled(); // Save
            expect(buttons.at(1)).not.toBeDisabled(); // Save as
            expect(buttons.at(2)).toBeDisabled(); // Delete
        }

    });

    it("Calls onSelect when columnset selection is changed", () => {
        const props = {
            columnSets,
            currentSet: "cde",
            currentColumns: ["c", "d", "e"],
            onSelect: () => { },
            onCreate: () => { },
            onDelete: () => { },
        };

        const onSelectSpy = spyOn(props, "onSelect");

        const component = mount(__(ColumnSet, props));

        // simulate onchange event of the selectbox
        // .simulate() can not be used here, because the select is not a DOM element
        component.find(Select).prop("onChange")({ target: { value: "abc" } });

        expect(onSelectSpy).toHaveBeenCalledWith(columnSets[0]);
    });

    it("Calls onCreate when a column set is created"); // Can't be tested yet due to window.prompt()

    it("Calls onCreate when a column set is updated", () => {
        const props = {
            columnSets,
            currentSet: "cde",
            currentColumns: ["c", "d", "e", "f"],
            onSelect: () => { },
            onCreate: () => { },
            onDelete: () => { },
        };

        const onCreateSpy = spyOn(props, "onCreate");

        const component = mount(__(ColumnSet, props));

        component.find(Button).at(0).simulate("click");

        expect(onCreateSpy).toHaveBeenCalledWith({
            id: "cde",
            label: "CDE",
            columns: ["c", "d", "e", "f"],
        });
    });

    it("Calls onDelete when a column set is deleted", () => {
        const props = {
            columnSets,
            currentSet: "cde",
            currentColumns: ["c", "d", "e"],
            onSelect: () => { },
            onCreate: () => { },
            onDelete: () => { },
        };

        const onDeleteSpy = spyOn(props, "onDelete");

        const component = mount(__(ColumnSet, props));

        component.find(Button).at(2).simulate("click");

        expect(onDeleteSpy).toHaveBeenCalledWith(columnSets[1]);
    });
});
