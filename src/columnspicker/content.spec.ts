import { Button, DialogActions, Select } from "@material-ui/core";
import { configure, mount, ReactWrapper } from "enzyme";
import { createElement as __ } from "react";
import AvailableColumns from "./availablecolumns";
import ColumnSetManager from "./columnset";
import { ColumnsPickerContent } from "./content";
import SortableColumns from "./sortablecolumns";
import { ENGLISH } from "../WordTranslator";

describe("ColumnsPicker: ColumnsPickerContent", () => {

    const columnSets = [
        {
            id: "abc",
            label: "ABC",
            columns: ["abc.1.1", "abc.1.2", "abc.2.3"],
        },
        {
            id: "cde",
            label: "CDE",
            columns: ["abc.1.2", "abc.1.3", "abc.2.2"],
        },
        {
            id: "readonly",
            label: "RO",
            columns: ["abc.1.2", "abc.1.3", "abc.2.2", "def.1.1"],
            readonly: true,
        },
    ];
    const columnGroups = [
        {
            name: "abc",
            label: "ABC",
            columns: [
                [
                    {
                        name: "abc.1.1",
                        label: "ABC11",
                        fixed: true,
                    },
                    {
                        name: "abc.1.2",
                        label: "ABC12",
                    },
                    {
                        name: "abc.1.3",
                        label: "ABC13",
                    },
                ],
                [
                    {
                        name: "abc.2.1",
                        label: "ABC21",
                    },
                    {
                        name: "abc.2.2",
                        label: "ABC22",
                    },
                    {
                        name: "abc.2.3",
                        label: "ABC23",
                    },
                ],
            ],
        },
        {
            name: "def",
            label: "DEF",
            columns: [
                [
                    {
                        name: "def.1.1",
                        label: "DEF11",
                    },
                ],
            ],
        },
    ];

    const classes = {
        dialogTitle: "",
        dialogTitleText: "",
        hintText: "",
        subheading: "",
    };
    const testProps = {
        opened: true,
        sets: columnSets,
        selectedColumns: ["abc.1.1", "abc.2.3"],
        columnGroups,
        onSetsChange: () => { },
        onDone: () => { },
        onDismiss: () => { },
        onClose: () => { },
        classes,
        language: ENGLISH,
    };
    it("Selecting/deselecting sets", () => {
        const props = testProps;

        const component = mount(__(ColumnsPickerContent, props) as any);

        expect(component.find(ColumnSetManager)).toHaveProp("currentSet", null);

        component.find(ColumnSetManager).prop("onSelect")(columnSets[2]);
        component.update();
        expect(component.find(ColumnSetManager)).toHaveProp("currentSet", "readonly");
        expect(component.find(SortableColumns)).toHaveProp("columns", [
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.2",
                label: "ABC12",
            }, {
                name: "abc.1.3",
                label: "ABC13",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            }, {
                name: "def.1.1",
                label: "DEF11",
            },
        ]);

        component.find(ColumnSetManager).prop("onSelect")(null);
        component.update();
        expect(component.find(ColumnSetManager)).toHaveProp("currentSet", null);

        expect(component.find(SortableColumns)).toHaveProp("columns", [
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.2",
                label: "ABC12",
            }, {
                name: "abc.1.3",
                label: "ABC13",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            }, {
                name: "def.1.1",
                label: "DEF11",
            },
        ]);

        component.unmount();

    });

    it("Reordering columns in a columnset", () => {
        const props = testProps;
        const onSetsChangeSpy = jest.spyOn(props, "onSetsChange");
        const onDoneSpy = jest.spyOn(props, "onDone");

        const component = mount(__(ColumnsPickerContent, props) as any);
        component.find(ColumnSetManager).prop("onSelect")(columnSets[1]);
        component.update();
        expect(component.find(SortableColumns)).toHaveProp("columns", [
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.2",
                label: "ABC12",
            }, {
                name: "abc.1.3",
                label: "ABC13",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            },
        ]);

        component.find(SortableColumns).prop("onSortColumns")([
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.3",
                label: "ABC13",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            }, {
                name: "abc.1.2",
                label: "ABC12",
            },
        ]);

        component.update();
        expect(component.find(ColumnSetManager).find(Select)).toHaveText("CDE*");

        component.find(ColumnSetManager).find(Button).at(0).simulate("click"); // Click on Save
        component.update();
        expect(onSetsChangeSpy).not.toHaveBeenCalled(); // Changes are only committed on done

        component.find(DialogActions).find(Button).last().simulate("click");
        component.update();

        expect(onSetsChangeSpy).toHaveBeenCalledWith([
            {
                id: "abc",
                label: "ABC",
                columns: ["abc.1.1", "abc.1.2", "abc.2.3"],
            },
            {
                id: "cde",
                label: "CDE",
                columns: ["abc.1.1", "abc.1.3", "abc.2.2", "abc.1.2"],
            },
            {
                id: "readonly",
                label: "RO",
                columns: ["abc.1.1", "abc.1.2", "abc.1.3", "abc.2.2", "def.1.1"],
                readonly: true,
            },
        ]);

        expect(onDoneSpy).toHaveBeenCalledWith(["abc.1.1", "abc.1.3", "abc.2.2", "abc.1.2"]);
        component.unmount();

    });

    it("Adding/removing columns in a columnset", () => {
        const props = testProps;

        const onSetsChangeSpy = jest.spyOn(props, "onSetsChange");
        const onDoneSpy = jest.spyOn(props, "onDone");

        const component: ReactWrapper<ColumnsPickerContent["props"], ColumnsPickerContent["state"], ColumnsPickerContent> = mount(__(ColumnsPickerContent, props));
        component.find(ColumnSetManager).prop("onSelect")(component.state("sets")[1]);
        component.update();
        expect(component.find(SortableColumns)).toHaveProp("columns", [
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.2",
                label: "ABC12",
            }, {
                name: "abc.1.3",
                label: "ABC13",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            },
        ]);

        component.find(AvailableColumns).prop("onClickColumn")({
            name: "abc.1.3",
            label: "ABC13",
        });

        component.find(AvailableColumns).prop("onClickColumn")({
            name: "abc.2.3",
            label: "ABC23",
        });

        component.update();
        expect(component.find(ColumnSetManager).find(Select)).toHaveText("CDE*");

        expect(component.find(SortableColumns)).toHaveProp("columns", [
            {
                name: "abc.1.1",
                label: "ABC11",
                fixed: true,
            }, {
                name: "abc.1.2",
                label: "ABC12",
            }, {
                name: "abc.2.2",
                label: "ABC22",
            }, {
                name: "abc.2.3",
                label: "ABC23",
            },
        ]);

        component.find(ColumnSetManager).find(Button).at(0).simulate("click"); // Click on Save
        component.update();
        expect(onSetsChangeSpy).not.toHaveBeenCalled(); // Changes are only committed on done

        component.find(DialogActions).find(Button).last().simulate("click");
        component.update();

        expect(onSetsChangeSpy).toHaveBeenCalledWith([
            {
                id: "abc",
                label: "ABC",
                columns: ["abc.1.1", "abc.1.2", "abc.2.3"],
            },
            {
                id: "cde",
                label: "CDE",
                columns: ["abc.1.1", "abc.1.2", "abc.2.2", "abc.2.3"],
            },
            {
                id: "readonly",
                label: "RO",
                columns: ["abc.1.1", "abc.1.2", "abc.1.3", "abc.2.2", "def.1.1"],
                readonly: true,
            },
        ]);

        expect(onDoneSpy).toHaveBeenCalledWith(["abc.1.1", "abc.1.2", "abc.2.2", "abc.2.3"]);
        component.unmount();
    });

});
