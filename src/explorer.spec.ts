import { mount, shallow, ShallowWrapper } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Component, createElement as __, DOM as _, ReactElement } from "react";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Explorer, Explorer_t, ExplorerNode_t } from "./explorer";
import { Fixture, simulateEvent, TestWrapper } from "./testUtils";

const muiTheme = getMuiTheme();

type TestExplorerNode_t = ExplorerNode_t & {
    children: TestExplorerNode_t[],
};

const childLower: TestExplorerNode_t = {
    id: "child-lower",
    primaryText: "ChildBottom",
    children: [],
};

const childLow: TestExplorerNode_t = {
    id: "child-low",
    primaryText: "Child",
    children: [childLower],
};

const root: TestExplorerNode_t = {
    id: "root",
    primaryText: "Parent",
    children: [childLow, childLower],
};

describe("Explorer", () => {
    beforeAll(() => {
        injectTapEventPlugin();
    });

    it("Should display the root node", async () => {
        const wrapper = Fixture(__(Explorer, {
            node: root,
            onRequestChildren: (node: TestExplorerNode_t) => Promise.resolve(node.children),
            onClick: () => null,
            onDrop: () => null,
        }));

        const rootItem = wrapper.find("ListItem").at(0);
        expect(rootItem.prop("primaryText")).toBe("Parent");

        // Expand root item
        rootItem.find("IconButton").at(0).simulate("click");
        await Promise.resolve(); // This promise will run after the other promise above
        const subItems = rootItem.children().find("ListItem");
        expect(subItems.length).toBe(2);
        expect(subItems.at(0).prop("primaryText")).toBe("Child");
        expect(subItems.at(1).prop("primaryText")).toBe("ChildBottom");

        // Expand sub item
        subItems.at(0).find("IconButton").at(0).simulate("click");
        await Promise.resolve(); // This promise will run after the other promise above
        const subsub = subItems.at(0).children().find("ListItem");
        expect(subsub.length).toBe(1);
        expect(subsub.at(0).prop("primaryText")).toBe("ChildBottom");

        // Expand bottom item
        subItems.at(1).find("IconButton").at(0).simulate("click");
        await Promise.resolve(); // This promise will run after the other promise above
        const bot = subItems.at(1).children().find("ListItem");
        expect(bot.length).toBe(0);
        expect(subItems.at(1).find("IconButton").exists()).toBe(false);
    });
});
