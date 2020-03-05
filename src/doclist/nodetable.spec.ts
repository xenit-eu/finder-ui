import { configure, mount } from "enzyme";

import { createElement } from "react";
import { Node_t } from "../metadata";
import { Fixture } from "../testUtils";
import { INodeTableRow, NodeTable, NodeTableSortDirection, NodeTableTranslations } from "./nodetable";
import { Property } from "./renderer";
function isRunningPhantom() {
    return navigator.userAgent.toLocaleLowerCase().indexOf("phantom") >= 0;
}
const phantomDescribe = isRunningPhantom() ? xdescribe : describe;

phantomDescribe("NodeList", () => {

    it("Renders an empty table when no data is passed", () => {
        const element = Fixture(createElement(NodeTable, {
            rows: [],
            columns: [{
                name: "cm:name",
                label: "Name",
                alignRight: false,
                sortable: true,
                sortDirection: NodeTableSortDirection.NONE,
                renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
            }],
            pager: {
                totalItems: 0,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged: () => { },
            onRowSelected: () => { },
            onRowMenuItemClicked: () => { },
            onSortChanged: () => { },
        }));

        const reactTable = element.find("ReactTable");
        // tslint:disable-next-line:no-console
        expect(reactTable).toHaveProp("page", 0);
        expect(reactTable).toHaveProp("pages", 0);

        expect(reactTable.find("NoData").exists()).toBe(true);
    });

    it("Renders the specified columns", () => {
        const element = Fixture(createElement(NodeTable, {
            rows: [{
                node: {
                    type: "cm:content",
                    aspects: ["cm:auditable"],
                    properties: {
                        "cm:name": ["XYZ"],
                        "cm:description": ["Blablabla"],
                    },
                },
                rowMenu: [],
                rowStyle: {},
            }, {
                node: {
                    type: "cm:content",
                    aspects: ["cm:auditable"],
                    properties: {
                        "cm:name": ["ABC"],
                        "cm:description": ["Blablabla"],
                    },
                },
                rowMenu: [],
                rowStyle: {},
            }],

            columns: [{
                name: "cm:name",
                label: "Name",
                alignRight: false,
                sortable: true,
                sortDirection: NodeTableSortDirection.NONE,
                renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
            }],
            pager: {
                totalItems: 2,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged: () => { },
            onRowSelected: () => { },
            onRowMenuItemClicked: () => { },
            onSortChanged: () => { },
        }));

        const reactTable = element.find("ReactTable");
        expect(reactTable).toHaveProp("page", 0);
        expect(reactTable).toHaveProp("pages", 1);
        const rows = reactTable.find("TableComponent Tbody TrComponent");

        expect(rows.length).toEqual(20); // There are always 20 rows rendered in total
        expect(rows.filterWhere(component => !component.hasClass("-padRow")).length).toEqual(2); // But 2 rows are not padding rows

        const cells = rows.first().find("TdComponent");

        expect(cells.length).toEqual(2);
        expect(cells.first().find("RowMenu").exists()).toBe(true);
        expect(cells.at(1).text()).toEqual("XYZ");

        expect(rows.at(1).find("TdComponent").at(1).text()).toEqual("ABC");
    });

    it("calls onRowSelected when a row is selected", () => {
        const onRowSelected = jest.fn();
        const node1 = {
            type: "cm:content",
            aspects: ["cm:auditable"],
            properties: {
                "cm:name": ["XYZ"],
                "cm:description": ["Blablabla"],
            },
        };
        const node2 = {
            type: "cm:content",
            aspects: ["cm:auditable"],
            properties: {
                "cm:name": ["ABC"],
                "cm:description": ["Blablabla"],
            },
        };
        const element = Fixture(createElement(NodeTable, {
            rows: [{
                node: node1,
                rowMenu: [],
                rowStyle: {},
            }, {
                node: node2,
                rowMenu: [],
                rowStyle: {},
            }],

            columns: [{
                name: "cm:name",
                label: "Name",
                alignRight: false,
                sortable: true,
                sortDirection: NodeTableSortDirection.NONE,
                renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
            }],
            pager: {
                totalItems: 2,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged: () => { },
            onRowSelected,
            onRowMenuItemClicked: () => { },
            onSortChanged: () => { },
        }));

        const rows = element.find("ReactTable TableComponent Tbody TrComponent");

        rows.at(0).find("TdComponent").at(1).simulate("click");

        expect(onRowSelected).toHaveBeenCalledWith(node1, 0);

        rows.at(1).find("TdComponent").at(1).simulate("click");

        expect(onRowSelected).toHaveBeenCalledWith(node2, 1);
    });

    it("calls onPageChanged when changing page", () => {
        const onPageChanged = jest.fn();
        const node1 = {
            type: "cm:content",
            aspects: ["cm:auditable"],
            properties: {
                "cm:name": ["XYZ"],
                "cm:description": ["Blablabla"],
            },
        };

        const rows: Array<INodeTableRow<any>> = [];
        for (let i = 0; i < 50; i++) {
            rows.push({
                node: node1,
                rowMenu: [],
                rowStyle: {},
            });
        }
        const element = Fixture(createElement(NodeTable), {
            rows,
            columns: [{
                name: "cm:name",
                label: "Name",
                alignRight: false,
                sortable: true,
                sortDirection: NodeTableSortDirection.NONE,
                renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
            }],
            pager: {
                totalItems: 50,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged,
            onRowSelected: () => { },
            onRowMenuItemClicked: () => { },
            onSortChanged: () => { },
        });
        expect(element.find("ReactTablePagination .-previous button")).toHaveProp("disabled", true);
        expect(element.find("ReactTablePagination .-next button")).toHaveProp("disabled", false);

        element.find("ReactTablePagination .-next button").simulate("click");

        expect(onPageChanged).toHaveBeenCalledWith(2);

        element.setProps({
            pager: {
                totalItems: 50,
                pageSize: 20,
                selectedPage: 2,
            },
        });

        expect(element.find("ReactTablePagination .-previous button")).toHaveProp("disabled", false);
        expect(element.find("ReactTablePagination .-next button")).toHaveProp("disabled", false);

        element.find("ReactTablePagination .-next button").simulate("click");
        expect(onPageChanged).toHaveBeenCalledWith(3);

        element.find("ReactTablePagination .-previous button").simulate("click");
        expect(onPageChanged).toHaveBeenCalledWith(1);

        element.setProps({
            pager: {
                totalItems: 50,
                pageSize: 20,
                selectedPage: 3,
            },
        });
        element.update();

        expect(element.find("ReactTablePagination .-previous button")).toHaveProp("disabled", false);
        expect(element.find("ReactTablePagination .-next button")).toHaveProp("disabled", true);
    });

    it("calls onRowMenuItemClicked when an item menu is clicked", () => {
        const onRowMenuItemClicked = jest.fn();

        const node1 = {
            type: "cm:content",
            aspects: ["cm:auditable"],
            properties: {
                "cm:name": ["XYZ"],
                "cm:description": ["Blablabla"],
            },
        };

        const rowMenu1 = [{
            label: "ABC label",
            key: "ABC",
            disabled: false,
        }, {
            label: "DEF label",
            key: "DEF",
            disabled: false,
        }, {
            label: "GHI label",
            key: "GHI",
            disabled: true,
        }];

        const node2 = {
            type: "cm:content",
            aspects: ["cm:auditable"],
            properties: {
                "cm:name": ["ABC"],
                "cm:description": ["Blablabla"],
            },
        };

        const rowMenu2 = [{
            label: "DEF label",
            key: "DEF",
            disabled: false,
        }];

        const element = Fixture(createElement(NodeTable, {
            rows: [{
                node: node1,
                rowMenu: rowMenu1,
                rowStyle: {},
            }, {
                node: node2,
                rowMenu: rowMenu2,
                rowStyle: {},
            }],

            columns: [{
                name: "cm:name",
                label: "Name",
                alignRight: false,
                sortable: true,
                sortDirection: NodeTableSortDirection.NONE,
                renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
            }],
            pager: {
                totalItems: 2,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged: () => { },
            onRowSelected: () => { },
            onRowMenuItemClicked,
            onSortChanged: () => { },
        }));

        const rowMenus = element.find("ReactTable TableComponent RowMenu");

        expect(rowMenus.at(0)).toHaveProp("menuItems", rowMenu1);
        expect(rowMenus.at(1)).toHaveProp("menuItems", rowMenu2);

        (rowMenus.at(0).prop("onMenuItemSelected") as any)("DEF", 1);

        expect(onRowMenuItemClicked).toHaveBeenCalledWith(node1, "DEF", 0, 1);

        (rowMenus.at(1).prop("onMenuItemSelected") as any)("DEF", 0);

        expect(onRowMenuItemClicked).toHaveBeenCalledWith(node2, "DEF", 1, 0);
    });

    it("calls onSortChanged when column sorting is changed", () => {
        const onSortChanged = jest.fn();
        const column1 = {
            name: "cm:name",
            label: "Name",
            alignRight: false,
            sortable: true,
            sortDirection: NodeTableSortDirection.NONE,
            renderer: Property({ parameters: {}, mapToView: (node: Node_t) => node.properties["cm:name"][0] }),
        };
        const element = Fixture(createElement(NodeTable, {
            rows: [{
                node: {
                    type: "cm:content",
                    aspects: ["cm:auditable"],
                    properties: {
                        "cm:name": ["XYZ"],
                        "cm:description": ["Blablabla"],
                    },
                },
                rowMenu: [],
                rowStyle: {},
            }, {
                node: {
                    type: "cm:content",
                    aspects: ["cm:auditable"],
                    properties: {
                        "cm:name": ["ABC"],
                        "cm:description": ["Blablabla"],
                    },
                },
                rowMenu: [],
                rowStyle: {},
            }],

            columns: [column1],
            pager: {
                totalItems: 2,
                pageSize: 20,
                selectedPage: 1,
            },
            onPageChanged: () => { },
            onRowSelected: () => { },
            onRowMenuItemClicked: () => { },
            onSortChanged,
        }));

        element.find("ReactTable Thead ThComponent .rt-th").at(1).simulate("click");

        expect(onSortChanged).toHaveBeenCalledWith([{ name: "cm:name", sortDirection: NodeTableSortDirection.ASC }]);

        element.find("ReactTable Thead ThComponent .rt-th").at(1).simulate("click");

        expect(onSortChanged).toHaveBeenCalledWith([{ name: "cm:name", sortDirection: NodeTableSortDirection.ASC }]);

        element.setProps({
            columns: [{
                ...column1,
                sortDirection: NodeTableSortDirection.ASC,
            }],
        });

        element.find("ReactTable Thead ThComponent .rt-th").at(1).simulate("click");

        expect(onSortChanged).toHaveBeenCalledWith([{ name: "cm:name", sortDirection: NodeTableSortDirection.DESC }]);
    });
});
