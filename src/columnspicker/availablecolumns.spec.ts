import { Chip, Divider, ListSubheader } from "@material-ui/core";
import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { Component, createElement as __ } from "react";
import AvailableColumns from "./availablecolumns";
import ColumnChip from "./chip";

configure({ adapter: new Adapter() });

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

describe("ColumnsPicker: AvailableColumns", () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const availableColumns = [
        {
            name: "abc",
            label: "ABC",
            columns: [
                [
                    {
                        name: "abc.1.1",
                        label: "ABC11",
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

    it("Shows a sectioned list of all available columns", () => {
        const props = {
            availableColumns,
            selectedColumns: [],
            onClickColumn: () => { },
        };
        const component = mount(__(AvailableColumns, props));

        const children = component.children().children().children();

        expect(children.length).toBe(4);

        // Header 1
        expect(children.at(0)).toMatchElement(__(ListSubheader, { component: "div" }, "ABC"));

        // Columns 1
        expect(children.at(1).type()).toBe("div");
        const columns1 = children.at(1).children();
        expect(columns1.length).toBe(7);
        expect(columns1.at(0)).toMatchElement(__(ColumnChip, { column: { name: "abc.1.1", label: "ABC11" }, selectedColumns: [] }));
        expect(columns1.at(0)).toHaveProp("column", { name: "abc.1.1", label: "ABC11" });
        expect(columns1.at(1)).toHaveProp("column", { name: "abc.1.2", label: "ABC12" });
        expect(columns1.at(2)).toHaveProp("column", { name: "abc.1.3", label: "ABC13" });
        expect(columns1.at(3)).toMatchElement(__(Divider));
        expect(columns1.at(4)).toHaveProp("column", { name: "abc.2.1", label: "ABC21" });
        expect(columns1.at(5)).toHaveProp("column", { name: "abc.2.2", label: "ABC22" });
        expect(columns1.at(6)).toHaveProp("column", { name: "abc.2.3", label: "ABC23" });

        // Header 2
        expect(children.at(2)).toMatchElement(__(ListSubheader, { component: "div" }, "DEF"));

        // Columns 2
        expect(children.at(3).type()).toBe("div");
        const columns2 = children.at(3).children();
        expect(columns2.length).toBe(1);
        expect(columns2.at(0)).toHaveProp("column", { name: "def.1.1", label: "DEF11" });
    });

    it("Shows selected columns as colored", () => {
        const props = {
            availableColumns,
            selectedColumns: ["abc.1.1", "def.1.1"],
            onClickColumn: () => { },
        };

        const component = mount(__(AvailableColumns, props));
        const children = component.children().children().children();

        expect(children.at(1).children().at(0).find(Chip)).toHaveProp("color", "primary");

        expect(children.at(1).children().at(1).find(Chip)).not.toHaveProp("color", "primary");

        expect(children.at(3).children().at(0).find(Chip)).toHaveProp("color", "primary");
    });

    it("Calls onClickColumn when a chip is clicked", () => {
        const props = {
            availableColumns,
            selectedColumns: ["abc.1.1", "def.1.1"],
            onClickColumn: () => { },
        };

        const onClickColumnSpy = spyOn(props, "onClickColumn");

        const component = mount(__(AvailableColumns, props));
        const children = component.children().children().children();

        children.at(1).children().at(0).find(Chip).simulate("click");

        expect(onClickColumnSpy).toHaveBeenCalledWith({
            name: "abc.1.1",
            label: "ABC11",
        });

        onClickColumnSpy.calls.reset();

        children.at(1).children().at(1).find(Chip).simulate("click");

        expect(onClickColumnSpy).toHaveBeenCalledWith({
            name: "abc.1.2",
            label: "ABC12",
        });
    });
});
