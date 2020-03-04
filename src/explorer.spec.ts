import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { Explorer, Explorer_t, ExplorerNode_t, ExplorerNode, ExplorerNode_Props_t } from "./explorer";
import { Fixture, simulateEvent, TestWrapper } from "./testUtils";

;

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
const simpleExplorerNodeProps: ExplorerNode_Props_t<ExplorerNode_t> = {
    onClick: () => { },
    onRequestChildren: () => Promise.resolve([]),
    onDrop: () => { },
    selectedNodes: [],
    node: {
        id: "string",
        primaryText: "string",
    },
    nestedLevel: 0,
};

describe("Explorer", () => {
    it("Should render the right icon of an explorer node", async () => {
        const explorerNodeIcon = new ExplorerNode(simpleExplorerNodeProps);
        const rightIcon = explorerNodeIcon.TEST_getRightIconButtonLoading();
        if (!rightIcon) {
            throw "Right icon should exist";
        }
        Fixture(rightIcon);

    });

    it("Should render a single explorer node", async () => {
        Fixture(__(ExplorerNode, simpleExplorerNodeProps));

    });
    it("Should display the root node", async () => {
        let childrenResolver = null;
        const wrappedProps: Explorer_t<ExplorerNode_t> = {
            node: root,
            onRequestChildren: (node: TestExplorerNode_t) => {
                childrenResolver = Promise.resolve(node.children);
                return childrenResolver;
            },
            onClick: () => null,
            onDrop: () => null,
            selectedNodes: [],
        };
        const wrapper = Fixture(Explorer(wrappedProps));

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
