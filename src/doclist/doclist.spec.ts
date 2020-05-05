
import { mount, shallow } from "enzyme";
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";

import { Fixture, simulateEvent } from "../__tests/testUtils";

import { Pager_t } from "../pager";
import { DocList, DocList_t, MenuItem_t, SortDirection_t } from "./doclist";

describe("DocList component tests", () => {

    it("should not display table if no data passed in props", () => {

        const props: DocList_t = {
            toggledRows: 0,
            columns: [

            ],
            data: [],
            pager: {
                totalItems: 0,
                pageSize: 15,
                selected: 0,
                pageSelected: (page: number) => { },
            },
            rowMenu: (i: number) => { return []; },
            rowToggled: (i: number): boolean => { return false; },
            className: "",
            rowStyle: (i: number) => { },
            togglable: false,

            onPageSelected: (pageIndex: number) => { },
            onRowSelected: (rowIndex: number) => { },
            onMenuSelected: (rowIndex: number, menuIndex: number, key?: string) => { },
            onSortColumnSelected: (columnIndex: number, columnName: string, direction: SortDirection_t) => { },
            onRowToggled: () => { },
            onDownloadButtonClick: () => { },
        };

        // const wrapper = mount(__(TestWrapper, {}, [__(DocList, props)]));
        const wrapper = Fixture(DocList(props));

        // console.log(wrapper.debug());

        expect(wrapper.find("table").length).toBe(0);

    });

    it("should display a table with 2 data row (1 page) when data with 1 col, 2 rows", () => {

        const name: string = "A";

        const props: DocList_t = {
            columns: [{
                name,
                label: "LabelA",
                alignRight: false,
                sortable: false,
                sortDirection: SortDirection_t.ASC,
            }],
            toggledRows: 0,
            data: [
                { A: "valueA_0" },
                { A: "valueA_1" },
            ],
            pager: {
                totalItems: 2,
                pageSize: 5,
                selected: 1,
                pageSelected: (page: number) => { },
            },
            rowMenu: (i: number) => { return []; },
            rowToggled: (i: number): boolean => { return false; },
            className: "",
            rowStyle: (i: number) => { },
            togglable: false,

            onPageSelected: (pageIndex: number) => { },
            onRowSelected: (rowIndex: number) => { },
            onMenuSelected: (rowIndex: number, menuIndex: number, key?: string) => { },
            onSortColumnSelected: (columnIndex: number, columnName: string, direction: SortDirection_t) => { },
            onRowToggled: () => { },
            onDownloadButtonClick: () => { },
        };

        const wrapper = Fixture(DocList(props));

        expect(wrapper.find("table").length).not.toBe(0);
        const table = wrapper.find("table");
        expect(table.find("thead tr th").at(1).text()).toBe(props.columns[0].label);
        if (!props.data) {
            throw "compiler unhappy";
        }
        expect(table.find("tbody tr").length).toBe(props.data.length);
        expect(table.find("tbody tr").at(0).find("td").at(1).text()).toBe(props.data[0][name]);
        expect(table.find("tbody tr").at(1).find("td").at(1).text()).toBe(props.data[1][name]);

        expect(wrapper.find("Pager").length).not.toBe(0);
        const pager = wrapper.find("Pager");

        expect(pager.find("Page").length).toBe(1);
        expect(pager.find("Page").at(0).prop("isActive")).toBe(true);
    });

    it('should call the "onRowSelected" callback when specific menu called', () => {

        const props: DocList_t = {
            columns: [{
                name: "A",
                label: "LabelA",
                alignRight: false,
                sortable: false,
                sortDirection: SortDirection_t.ASC,
            }],
            data: [
                { A: "valueA_0" },
                { A: "valueA_1" },
            ],
            pager: {
                totalItems: 2,
                pageSize: 5,
                selected: 1,
                pageSelected: (page: number) => { },
            },
            rowMenu: (i: number) => { return []; },
            rowToggled: (i: number): boolean => { return false; },
            className: "",
            rowStyle: (i: number) => { },
            togglable: false,
            toggledRows: 0,

            onPageSelected: (pageIndex: number) => { },
            onRowSelected: (rowIndex: number) => { },
            onMenuSelected: (rowIndex: number, menuIndex: number, key?: string) => { },
            onSortColumnSelected: (columnIndex: number, columnName: string, direction: SortDirection_t) => { },
            onRowToggled: () => { },
            onDownloadButtonClick: () => { },
        };

        jest.spyOn(props, "onRowSelected").mockImplementation(() => { });

        const wrapper = Fixture(DocList(props));

        expect(wrapper.find("table").length).not.toBe(0);
        const table = wrapper.find("table");

        table.find("tbody tr").find("td").at(3).simulate("click");

        expect(props.onRowSelected).toHaveBeenCalledWith(1);
    });

    it('should call the "onMenuSelected" callback when specific menu called', () => {

        const props: DocList_t = {
            columns: [{
                name: "A",
                label: "LabelA",
                alignRight: false,
                sortable: false,
                sortDirection: SortDirection_t.ASC,
            }],
            data: [
                { A: "valueA_0" },
                { A: "valueA_1" },
            ],
            pager: {
                totalItems: 2,
                pageSize: 5,
                selected: 1,
                pageSelected: (page: number) => { },
            },
            rowMenu: (i: number): MenuItem_t[] => {
                return [{ key: "aaa", label: "AAA", disabled: false }, { key: "bbb", label: "BBB", disabled: false }, { key: "ccc", label: "CCC", disabled: false }];
            },
            toggledRows: 0,
            rowToggled: (i: number): boolean => { return false; },
            className: "",
            rowStyle: (i: number) => { },
            togglable: false,

            onPageSelected: (pageIndex: number) => { },
            onRowSelected: (rowIndex: number) => { },
            onMenuSelected: (rowIndex: number, menuIndex: number, key?: string) => { },
            onSortColumnSelected: (columnIndex: number, columnName: string, direction: SortDirection_t) => { },
            onRowToggled: () => { },
            onDownloadButtonClick: () => { },
        };

        jest.spyOn(props, "onMenuSelected").mockImplementation(() => { });

        const wrapper = Fixture(DocList(props));

        const table = wrapper.find("table");
        const menuWrapper = Fixture((<any> table).find("tbody tr").at(1).find("RenderToLayer").prop("render")());

        // console.log(menuWrapper.debug());

        // simulate click on third menu
        menuWrapper.find("MenuItem").find("EnhancedButton").at(2).simulate("click");

        expect(props.onMenuSelected).toHaveBeenCalledWith(1, 2, "ccc");

    });

});
