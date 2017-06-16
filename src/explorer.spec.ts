import { mount, shallow, ShallowWrapper } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Component, createElement as __, DOM as _, ReactElement } from "react";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { DocumentTreeNode_t, TreeNode } from "./explorer";
import { Fixture, simulateEvent, TestWrapper } from "./testUtils";


const muiTheme = getMuiTheme();
const childLower: DocumentTreeNode_t = { open: true, id: "c", isFolder: false, Toggle: () => { }, Click: () => { }, text: "ChildBottom", children: [] };
const childLow: DocumentTreeNode_t = { open: true, id: "c", isFolder: false, Toggle: () => { }, Click: () => { }, text: "Child", children: [childLower] };
const case1: DocumentTreeNode_t = { open: true, id: "c", isFolder: true, Toggle: () => { }, Click: () => { }, text: "Parent", children: [childLow, childLower] };

const primaryText = "primaryText";

describe("Treeview test", () => {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    it("should display nested items", () => {
        const wrapper = Fixture(__(TreeNode, case1));
        let list = wrapper;
        const topListItems = list.find("ListItem");
        expect(topListItems.get(0).props[primaryText]).toBe("Parent");
        const subItems = topListItems.at(0).prop("nestedItems").map((c: ReactElement<any>) => Fixture(c, { context: { muiTheme } }));
        const subItem = subItems[0].find("ListItem").at(0);
        expect(subItem.prop(primaryText)).toBe("Child");
    });
});
