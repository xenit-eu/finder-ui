
import { mount, shallow } from "enzyme";
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";

import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Fixture, simulateEvent } from "./testUtils";

import { Pager_t } from "./pager";
import Pager from "./pager";

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

describe("Pager component tests", () => {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it("should display no page to display when totalItems = 0", () => {
        const props: Pager_t = {
            totalItems: 0,
            pageSize: 15,
            selected: 1,
            pageSelected: (page: number) => { },
        };

        const wrapper = Fixture(Pager(props));

        // console.log(wrapper.debug());

        expect(wrapper.find("Page").length).toBe(0);
        expect(wrapper.find("PreviousPageLink").length).not.toBe(0);
        expect(wrapper.find("NextPageLink").length).not.toBe(0);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(false);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(false);

    });

    it("should display 1 page when totalItems <= pageSize", () => {

        const props: Pager_t = {
            totalItems: 3,
            pageSize: 15,
            selected: 1,
            pageSelected: (page: number) => { },
        };

        const wrapper = Fixture(Pager(props));

        // console.log(wrapper.find('Page').debug());

        expect(wrapper.find("Page").length).not.toBe(0);
        expect(wrapper.find("Page").length).toBe(1);
        expect(wrapper.find("PreviousPageLink").length).not.toBe(0);
        expect(wrapper.find("NextPageLink").length).not.toBe(0);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(false);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(false);

    });

    it("should display more than 1 page when totalItems > pageSize", () => {

        const props: Pager_t = {
            totalItems: 40,
            pageSize: 15,
            selected: 1,
            pageSelected: (page: number) => { },
        };

        const wrapper = Fixture(Pager(props));

        // console.log(wrapper.find('Page').debug());

        expect(wrapper.find("Page").length).not.toBe(0);
        expect(wrapper.find("Page").length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(false);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(true);

    });

    it("should change to active another page clicked", () => {

        const props: Pager_t = {
            totalItems: 40, // 3 pages
            pageSize: 15,
            selected: 1,
            pageSelected: (page: number) => { },
        };

        spyOn(props, "pageSelected");

        const wrapper = Fixture(Pager(props));
        const pages = wrapper.find("Page");

        // console.log(pages.at(1).debug());

        expect(pages.length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(false);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(true);

        expect(pages.at(0).prop("isActive")).toBe(true);
        expect(pages.at(1).prop("isActive")).toBe(false);
        expect(pages.at(2).prop("isActive")).toBe(false);

        pages.at(1).find("FlatButton").simulate("click");

        expect(props.pageSelected).toHaveBeenCalledWith(2);
    });

    it("should be able to push next & previous button (both active ) when active page is not first & not last page", () => {

        const props: Pager_t = {
            totalItems: 40, // 3 pages
            pageSize: 15,
            selected: 2,
            pageSelected: (page: number) => { },
        };

        spyOn(props, "pageSelected");

        const wrapper = Fixture(Pager(props));
        const pages = wrapper.find("Page");

        // console.log(pages.at(1).debug());

        expect(pages.length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(true);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(true);

        expect(pages.at(0).prop("isActive")).toBe(false);
        expect(pages.at(1).prop("isActive")).toBe(true);
        expect(pages.at(2).prop("isActive")).toBe(false);

        pages.at(2).find("FlatButton").simulate("click");

        expect(props.pageSelected).toHaveBeenCalledWith(3);

    });

    it('should be able to push only "previous" button (not "next") when on last page', () => {

        const props: Pager_t = {
            totalItems: 40, // 3 pages
            pageSize: 15,
            selected: 3,
            pageSelected: (page: number) => { },
        };

        const wrapper = Fixture(Pager(props));
        const pages = wrapper.find("Page");

        // console.log(pages.at(1).debug());

        expect(pages.length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(true);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(false);

        expect(pages.at(0).prop("isActive")).toBe(false);
        expect(pages.at(1).prop("isActive")).toBe(false);
        expect(pages.at(2).prop("isActive")).toBe(true);

    });

    it('should return next page index when clicking on "next" button', () => {

        const props: Pager_t = {
            totalItems: 40, // 3 pages
            pageSize: 15,
            selected: 1,
            pageSelected: (page: number) => { },
        };

        spyOn(props, "pageSelected");

        const wrapper = Fixture(Pager(props));
        const pages = wrapper.find("Page");

        expect(pages.length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(false);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(true);

        expect(pages.at(0).prop("isActive")).toBe(true);
        expect(pages.at(1).prop("isActive")).toBe(false);
        expect(pages.at(2).prop("isActive")).toBe(false);

        wrapper.find("NextPageLink").find("FlatButton").simulate("click");
        expect(props.pageSelected).toHaveBeenCalledWith(2);

    });

    it('should return previous page index when clicking on "previous" button', () => {

        const props: Pager_t = {
            totalItems: 40, // 3 pages
            pageSize: 15,
            selected: 2,
            pageSelected: (page: number) => { },
        };

        spyOn(props, "pageSelected");

        const wrapper = Fixture(Pager(props));
        const pages = wrapper.find("Page");

        expect(pages.length).toBe(3);

        expect(wrapper.find("PreviousPageLink").prop("isActive")).toBe(true);
        expect(wrapper.find("NextPageLink").prop("isActive")).toBe(true);

        expect(pages.at(0).prop("isActive")).toBe(false);
        expect(pages.at(1).prop("isActive")).toBe(true);
        expect(pages.at(2).prop("isActive")).toBe(false);

        wrapper.find("PreviousPageLink").find("FlatButton").simulate("click");
        expect(props.pageSelected).toHaveBeenCalledWith(1);

    });

});
