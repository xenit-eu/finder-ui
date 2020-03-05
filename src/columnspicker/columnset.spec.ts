import { Button, Select } from "@material-ui/core";
import { configure, mount } from "enzyme";
import { createElement as __ } from "react";
import * as React from "react";
import { ENGLISH } from "../WordTranslator";
import ColumnSet from "./columnset";

describe("ColumnsPicker: ColumnSet", () => {

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
    const testProps = {
        columnSets,
        currentSet: "cde",
        currentColumns: ["c", "d", "e"],
        onSelect: () => { },
        onCreate: () => { },
        onDelete: () => { },
        language: ENGLISH,
    };
    it("Works when no column sets are availble", () => {
        const props = { ...testProps, columnSets: [], currentSet: null };

        const component = mount(__(ColumnSet, props));

        const selectField = component.find(Select);

        expect(selectField).toHaveProp("value", "");
        expect(selectField).toHaveText("(None)");

        const buttons = component.find(Button);

        expect(buttons.at(0)).toBeDisabled(); // Save
        expect(buttons.at(1)).not.toBeDisabled(); // Save as
        expect(buttons.at(2)).toBeDisabled(); // Delete
    });

    it("Shows available column sets", () => {
        const props = { ...testProps };

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
        const props = { ...testProps };

        const onSelectSpy = jest.spyOn(props, "onSelect");

        const component = mount(__(ColumnSet, props));

        // simulate onchange event of the selectbox
        // .simulate() can not be used here, because the select is not a DOM element
        component.find(Select).prop("onChange")!({ target: { value: "abc" } } as React.ChangeEvent<HTMLSelectElement>, null as any);

        expect(onSelectSpy).toHaveBeenCalledWith(columnSets[0]);
    });

    test.todo("Calls onCreate when a column set is created"); // Can't be tested yet due to window.prompt()

    it("Calls onCreate when a column set is updated", () => {
        const props = { ...testProps, currentColumns: ["c", "d", "e", "f"] };

        const onCreateSpy = jest.spyOn(props, "onCreate");

        const component = mount(__(ColumnSet, props));

        component.find(Button).at(0).simulate("click");

        expect(onCreateSpy).toHaveBeenCalledWith({
            id: "cde",
            label: "CDE",
            columns: ["c", "d", "e", "f"],
        });
    });

    it("Calls onDelete when a column set is deleted", () => {
        const props = { ...testProps };

        const onDeleteSpy = jest.spyOn(props, "onDelete");

        const component = mount(__(ColumnSet, props));

        component.find(Button).at(2).simulate("click");

        expect(onDeleteSpy).toHaveBeenCalledWith(columnSets[1]);
    });
});
