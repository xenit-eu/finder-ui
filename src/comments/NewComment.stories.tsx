import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Page } from "puppeteer";
import * as React from "react";
import { interceptAction } from "../__tests/puppeteerActionInterceptor";
import NewComment from "./NewComment";

export default {
    title: "comments/NewComment",
    component: NewComment,
};

export const initialMode = () => <NewComment
    isEditing={false}
    isSaving={false}
    onCreate={action("create")}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;

initialMode.story = {
    parameters: {
        async puppeteerTest(page: Page) {
            const createActionPromise = interceptAction(page, "create");

            const button = await page.$("button");
            await button.click();

            const createAction = await createActionPromise;
            expect(createAction.name).toEqual("create");
        },
    },
};

export const editMode = () => <NewComment
    isEditing={true}
    isSaving={boolean("isSaving", false)}
    onCreate={action("create")}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;

editMode.story = {
    parameters: {
        async puppeteerTest(page: Page) {
            const saveActionPromise = interceptAction(page, "save");
            const cancelActionPromise = interceptAction(page, "cancel");

            const buttons = await page.$$("button");

            const buttonsText = await Promise.all(buttons.map((buttonHandle) => buttonHandle.evaluate((button: HTMLElement) => button.innerText)));

            const saveButton = buttons[buttonsText.indexOf("COMMENTS/NEWCOMMENT/SAVE")];
            expect(saveButton).toBeDefined();
            const cancelButton = buttons[buttonsText.indexOf("COMMENTS/NEWCOMMENT/CANCEL")];
            expect(cancelButton).toBeDefined();

            const textArea = await page.$("[contenteditable]");
            await textArea.type("Some comment text");
            await saveButton.click();
            const saveAction = await saveActionPromise;
            expect(saveAction.name).toEqual("save");
            expect(saveAction.args).toEqual(["<p>Some comment text</p>"]);

            await cancelButton.click();

            const cancelAction = await cancelActionPromise;
            expect(cancelAction.name).toEqual("cancel");
        },
    },
};
