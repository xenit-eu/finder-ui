import {configure, mount} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {createElement as __} from "react";
import {ConfigurationDialog, ConfigurationDialog_Props_t} from "./index";
import {Button, IconButton, Input, ListItem, Radio, Select} from "@material-ui/core";
import AddCircle from "@material-ui/core/SvgIcon/SvgIcon";

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
            fr: "Français",
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
            layouts: [{name: "hello", value: "mama"}],
            currentLayout: "currentLayout",
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
        expect(spySave).toHaveBeenCalledWith({language: "nl"}, [{name: "hello", value: "mama"}], undefined);
    });

    it("saving and switching layouts", () => {
        const props: ConfigurationDialog_Props_t = {
           ...defaultProps,
        };

        const spySave = spyOn(props, "onSave");
        const component = mount(__(ConfigurationDialog, props));
        component.find(Input).filter(".manage-layouts-input").prop("onChange")({target: {value: "newlayout"}});
        component.find(AddCircle).filter(".save-current-layout").simulate("click");
        component.find(Button).filter(".configuration-dialog-done-button").simulate("click");
        expect(spySave).toHaveBeenCalledWith({language: "nl"}, [{name: "hello", value: "mama"}, {name: "newlayout", value: "currentLayout"}], "newlayout");

        spySave.calls.reset();
        component.find(ListItem).filter(".layout-item-hello").find(Radio).simulate("click");
        component.find(Button).filter(".configuration-dialog-done-button").simulate("click");
        expect(spySave).toHaveBeenCalledWith({language: "nl"}, [{name: "hello", value: "mama"}, {name: "newlayout", value: "currentLayout"}], "hello");
    });

});
