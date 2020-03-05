
import { mount, shallow, ShallowWrapper } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { Facets, Facets_t } from "./facets";
import { simulateEvent, TestWrapper } from "./testUtils";

;

const muiTheme = getMuiTheme();

const case1: Facets_t = {
    facets: [
        {
            name: "F1",
            label: "Facet1",
            values: [
                { count: 3, label: "Label1", value: "V1" },
                { count: 9, label: "Label2", value: "V2" },
            ],
        },
    ],
    // tslint:disable-next-line:no-console
    onFacetSelected: (name, value) => console.log(name, value),
};

describe("Facets test", () => {

    it("should display 2 nested Lists with corresponding ListItems", () => {

        const wrapper = shallow(__(Facets, case1));
        // console.log(wrapper.debug());

        const list = wrapper.find("List");
        expect(list.find("ListItem").length).toBe(case1.facets.length);

        const topListItem = list.find("ListItem");

        expect(topListItem.prop("primaryText")).toBe(case1.facets[0].label);

        const subListItems = (<any> topListItem).prop("nestedItems").map((c: ReactElement<any>) => mount(c, { context: { muiTheme } }));
        expect(subListItems.length).toBe(case1.facets[0].values.length);

        // check value of sub-items labels.
        expect(subListItems.map((a: ShallowWrapper<any, any>) => a.prop("primaryText"))).toEqual(case1.facets[0].values.map(a => a.label));

        // check value of badges (counts)
        expect(subListItems.map((a: ShallowWrapper<any, any>) => a.find("Badge").text())).toEqual(case1.facets[0].values.map(a => a.count.toString()));

    });

    it("should call callback function when facet value clicked", () => {

        jest.spyOn(case1, "onFacetSelected").mockImplementation(() => { });

        const wrapper = shallow(__(Facets, case1));
        const topListItem = wrapper.find("ListItem");
        const subListItems = (<any> topListItem).prop("nestedItems").map((c: ReactElement<any>) => mount(c, { context: { muiTheme } }));

        simulateEvent(subListItems[1].find("EnhancedButton"), "click");

        expect(case1.onFacetSelected).toHaveBeenCalledWith("F1", "Facet1", "V2", "Label2");

    });

});
