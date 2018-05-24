import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Explorer, Explorer_t, ExplorerNode_t } from "./explorer";
import { Fixture, simulateEvent, TestWrapper } from "./testUtils";

import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

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

function getRoot(wrapper: ReactWrapper) {
    return wrapper.find("ListItem").at(0);
}

function getChild(wrapper: ReactWrapper, ...idxs: number[]) {
    let child = getRoot(wrapper);
    for (let i of idxs) {
        child = child.children().find("ListItem").at(i);
    }
    return child;
}

describe("Explorer", () => {
    beforeAll(() => {
        injectTapEventPlugin();
    });

    it("Should display the root node", async () => {
        let childrenResolver = null;

        const wrapper = Fixture(__(Explorer, {
            node: root,
            onRequestChildren: (node: TestExplorerNode_t) => {
                return childrenResolver = Promise.resolve(node.children);
            },
            onClick: () => null,
            onDrop: () => null,
        }));

        let rootItem = getRoot(wrapper);
        expect(rootItem.prop("primaryText")).toBe("Parent");
        // Expand root item
        rootItem.find("IconButton").at(0).simulate("click");
        await childrenResolver; // This promise will run after the other promise in onRequestChildren
        wrapper.update();

        const subItems = getRoot(wrapper).children().find("ListItem");
        expect(subItems.length).toBe(2);
        expect(getChild(wrapper, 0).prop("primaryText")).toBe("Child");
        expect(getChild(wrapper, 1).prop("primaryText")).toBe("ChildBottom");
        // Expand sub item
        getChild(wrapper, 0).find("IconButton").at(0).simulate("click");
        await childrenResolver; // This promise will run after the other promise in onRequestChildren
        wrapper.update();

        const subsub = getChild(wrapper, 0).children().find("ListItem");
        expect(subsub.length).toBe(1);
        expect(getChild(wrapper, 0, 0).prop("primaryText")).toBe("ChildBottom");

        // Expand bottom item
        getChild(wrapper, 1).find("IconButton").at(0).simulate("click");
        await childrenResolver; // This promise will run after the other promise in onRequestChildren
        wrapper.update();
        const bot = getChild(wrapper, 1).children().find("ListItem");
        expect(bot.length).toBe(0);
        expect(getChild(wrapper, 1).find("IconButton").exists()).toBe(false);
    });
});
