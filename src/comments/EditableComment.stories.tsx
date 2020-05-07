import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Page } from "puppeteer";
import * as React from "react";
import { interceptAction } from "../__tests/puppeteerActionInterceptor";
import EditableComment from "./EditableComment";

export default {
    title: "comments/EditableComment",
    component: EditableComment,
};

export const normal = () => <EditableComment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Once a police officer caught Chuck Norris, the cop was lucky enough to escape with a warning.",
    }}
    isSaving={boolean("isSaving", false)}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;

normal.story = {
    parameters: {
        async puppeteerTest(page: Page) {

            const saveActionPromise = interceptAction(page, "save");
            const cancelActionPromise = interceptAction(page, "cancel");

            const buttons = await page.$$("button");

            const buttonsText = await Promise.all(buttons.map((buttonHandle) => buttonHandle.evaluate((button: HTMLElement) => button.innerText)));

            const saveButton = buttons[buttonsText.indexOf("COMMENTS/EDITABLECOMMENT/SAVE")];
            expect(saveButton).toBeDefined();
            const cancelButton = buttons[buttonsText.indexOf("COMMENTS/EDITABLECOMMENT/CANCEL")];
            expect(cancelButton).toBeDefined();

            const textArea = await page.$("[contenteditable]");
            await textArea.type("Some comment text.");
            await saveButton.click();
            const saveAction = await saveActionPromise;
            expect(saveAction.name).toEqual("save");
            expect(saveAction.args).toEqual(["<p>Some comment text.Once a police officer caught Chuck Norris, the cop was lucky enough to escape with a warning.</p>"]);

            await cancelButton.click();

            const cancelAction = await cancelActionPromise;
            expect(cancelAction.name).toEqual("cancel");
        },
    },
};

export const multiLine = () => <EditableComment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Once a police officer caught Chuck Norris.<br>The cop was lucky enough to escape with a warning.",
    }}
    isSaving={boolean("isSaving", false)}
    onSave={action("save")}
    onCancel={action("cancel")}
/>;
