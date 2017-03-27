// tslint:disable:only-arrow-functions

import { mount, shallow } from "enzyme";
import { Component, createElement as __, DOM as _, PropTypes } from "react";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { simulateEvent, TestWrapper } from "./testUtils";

/**
 *  enzyme lib playground
 *      doc: http://airbnb.io/enzyme/docs/api/ReactWrapper/text.html
 *
 */
describe("enzyme usage", () => {
    it("stateless components as functions to be findable by name", () => {

        // prefer function over arrow function to define stateless component
        // otherwise components are named as 'Component' instead of real name.
        //      cfr https://github.com/airbnb/enzyme/issues/262
        //      cfr https://github.com/airbnb/javascript/tree/master/react#class-vs-reactcreateclass-vs-stateless

        const InnerComponent = function InnerComponent () { return _.div({className: "inner"}, "foobar"); } ;
        const OuterComponent = function OuterComponent () { return _.div({className: "outer"}, __(InnerComponent)); };

        const inner = mount(__(InnerComponent));
        const outer = mount(__(OuterComponent));

        // console.log(inner.debug());
        // console.log(outer.debug());

        expect(outer.find("InnerComponent").text()).toBe("foobar");
        expect(outer.find(".inner").text()).toBe("foobar");

    });
});
