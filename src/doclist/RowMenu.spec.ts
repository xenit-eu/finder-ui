import { configure, mount, shallow } from "enzyme";
import { createElement } from "react";
import { Fixture } from "../testUtils";
import DynamicRowMenu, { RowMenu } from "./RowMenu";

describe("Doclist DynamicRowMenu", () => {

    it("Renders row menu with passed parameters", () => {
        const menuItems = [
            {
                key: "abc",
                label: "xyz",
                disabled: true,
            },
            {
                key: "def",
                label: "ghi",
                disabled: false,
            },
        ];
        const element = shallow(createElement(DynamicRowMenu, {
            menuItems,
            onMenuItemSelected: () => { },

        }));

        expect(element.find(RowMenu).length).toEqual(1);
        expect(element.find(RowMenu).prop("menuItems")).toEqual(menuItems);
        expect(element.find(RowMenu).prop("open")).toBe(false);

    });

    it("Renders the row menu and loads additional parameters when opened", async () => {
        const menuItems = [
            {
                key: "abc",
                label: "xyz",
                disabled: true,
            },
            {
                key: "def",
                label: "ghi",
                disabled: false,
            },
        ];
        const promisesToAwait: Array<Promise<any>> = [];
        const element = shallow(createElement(DynamicRowMenu, {
            menuItems,
            onMenuItemSelected: () => { },
            onMenuLoadRequested: (callback) => {
                const p: Promise<void> = new Promise((resolve) => {
                    setTimeout(() => {
                        callback(0, {
                            key: "abc",
                            label: "DDD",
                            disabled: false,
                        });
                        resolve();
                    }, 10);
                });
                promisesToAwait.push(p);
                return p;
            },
        }));
        // Trigger open of the menu
        (element.find(RowMenu).prop("onRequestChange") as Function)(true);

        // Menu should not be open yet
        expect(element.find(RowMenu).prop("open")).toBe(false);

        // Wait until promises have resolved
        await Promise.all(promisesToAwait);

        expect(element.find(RowMenu).prop("menuItems")).toEqual([
            {
                key: "abc",
                label: "DDD",
                disabled: false,
            },
            {
                key: "def",
                label: "ghi",
                disabled: false,
            },
        ]);
        expect(element.find(RowMenu).prop("open")).toBe(true);

    });

});
