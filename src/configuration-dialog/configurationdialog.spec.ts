import {configure, mount} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {Component, createElement as __} from "react";
import {ConfigurationDialog, ConfigurationDialog_Props_t} from "./index";
import {Button, Select} from "@material-ui/core";

configure({adapter: new Adapter()});

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

describe("Basic generalSettings dialog test", () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const defaultProps: ConfigurationDialog_Props_t = {
        open: true,
        languages: {
            nl: "Nederlands",
            fr: "French",
            en: "English",
        },
        onSave: () => {
        },
        onClose: () => {
        },
        generalSettings: {
            language: "nl",
        },
        manageLayouts: {
            layoutNames: ["hello", "world", "default"],
            currentLayout: "hello",
        },
    };

    it("dropdown contains preconfigured language", () => {
        const props: ConfigurationDialog_Props_t = {...defaultProps};

        const component = mount(__(ConfigurationDialog, props));
        expect(component.find(Select)).toHaveProp("value", "nl");
    });

    it("onSave gets called", () => {
        const props: ConfigurationDialog_Props_t = {
            ...defaultProps,
        };

        const spySave = spyOn(props, "onSave");
        const component = mount(__(ConfigurationDialog, props));

        component.find(Button).filter(".configuration-dialog-done-button").simulate("click");
        expect(spySave).toHaveBeenCalledWith({
            language: "nl",
        });
    });

});
