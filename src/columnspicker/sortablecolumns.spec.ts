import { Chip, SvgIcon } from "@material-ui/core";
import { configure, mount } from "enzyme";
import { createElement as __ } from "react";
import SortableColumns from "./sortablecolumns";

describe("ColumnsPicker: SortableColumns", () => {

    const columns = [
        {
            name: "abc.2.1",
            label: "ABC21",
        },
        {
            name: "def.1.1",
            label: "DEF11",
        },
        {
            name: "abc.2.2",
            label: "ABC22",
        },
    ];

    it("Shows a list of columns in order", () => {
        const props = {
            columns,
            onSortColumns: () => { },
            onDeleteColumn: () => { },
        };
        const component = mount(__(SortableColumns, props));
        const chips = component.find(Chip);

        expect(chips.at(0)).toHaveProp("label", "ABC21");
        expect(chips.at(1)).toHaveProp("label", "DEF11");
        expect(chips.at(2)).toHaveProp("label", "ABC22");
    });

    it("Calls onDeleteColumn when the delete button is pressed", () => {
        const props = {
            columns,
            onSortColumns: () => { },
            onDeleteColumn: () => { },
        };

        const onDeleteColumnSpy = jest.spyOn(props, "onDeleteColumn");

        const component = mount(__(SortableColumns, props));
        const chips = component.find(Chip);

        chips.at(1).find(SvgIcon).simulate("click"); // Click the delete icon

        expect(onDeleteColumnSpy).toHaveBeenCalledWith({
            name: "def.1.1",
            label: "DEF11",
        });

    });
});
