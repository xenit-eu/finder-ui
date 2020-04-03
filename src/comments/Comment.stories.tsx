import { action } from "@storybook/addon-actions";
import type { ElementHandle, Page } from "puppeteer";
import * as React from "react";
import { interceptAction, stopIntercept } from "../puppeteerActionInterceptor";
import Comment from "./Comment";

export default {
    title: "comments/Comment",
    component: Comment,
};

export const withoutModify = () => <Comment comment={{
    author: "C. Norris",
    date: new Date("2020-04-01T00:00:00.000Z"),
    body: "Once a police officer caught Chuck Norris, the cop was lucky enough to escape with a warning.",
}} />;

export const multiLine = () => <Comment comment={{
    author: "C. Norris",
    date: new Date("2020-04-01T00:00:00.000Z"),
    body: "Once a police officer caught Chuck Norris.<br>The cop was lucky enough to escape with a warning.",
}} />;

export const withEdit = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't bug hunt as that signifies a probability of failure, he goes bug killing.",
    }}
    onEdit={action("edit")}
/>;

withEdit.story = {
    parameters: {
        async puppeteerTest(page: Page) {
            const editActionPromise = interceptAction(page, "edit");

            const editButton = await page.$("button[aria-label='comments/Comment/edit']");
            await editButton.click();

            const editAction = await editActionPromise;
            expect(editAction.name).toEqual("edit");

            stopIntercept(page);
        },
    },
};

export const withDelete = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants.",
    }}
    onDelete={action("delete")}
/>;

withDelete.story = {
    parameters: {
        async puppeteerTest(page: Page) {
            const deleteActionPromise = interceptAction(page, "delete");

            const deleteButton = await page.$("button[aria-label='comments/Comment/delete']");
            await deleteButton.click();

            const deleteAction = await deleteActionPromise;
            expect(deleteAction.name).toEqual("delete");
            stopIntercept(page);
        },
    },
};

export const withEditAndDelete = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants.",
    }}
    onEdit={action("edit")}
    onDelete={action("delete")}
/>;

async function getAttribute(element: ElementHandle, attribute: string): Promise<string | null> {
    const attr = await element.$x("./@" + attribute);
    if (attr.length !== 1) {
        return null;
    }
    const property = await attr[0].getProperty("value");
    return await property.jsonValue() as string;
}

async function findEntryMatching<E extends HTMLElement>(elements: Array<ElementHandle<E>>, content: string): Promise<ElementHandle<E> | null> {
    const entriesMatches = await Promise.all(elements.map((elem) => elem.evaluate((browserElem, browserContent) => browserElem.innerText === browserContent, content)));
    const firstIndex = entriesMatches.indexOf(true);
    if (firstIndex === -1) {
        return null;
    }
    return elements[firstIndex];
}

withEditAndDelete.story = {
    parameters: {
        async puppeteerTest(page: Page) {
            const editActionPromise = interceptAction(page, "edit");
            const deleteActionPromise = interceptAction(page, "delete");

            const menuButton = await page.$("button[aria-label='menu/PopupMenu/more']");
            await menuButton.click();
            await page.waitForSelector("button[aria-label='menu/PopupMenu/more'][aria-owns]", { timeout: 1000 });
            const menuId = await getAttribute(menuButton, "aria-owns");
            expect(menuId).toBeDefined();

            const menu = await page.$("#" + menuId);
            expect(menu).not.toBeNull();

            expect(await menu.isIntersectingViewport()).toEqual(true);

            const editMenuItem = await findEntryMatching<HTMLElement>(await menu.$$("[role=menuitem]"), "comments/Comment/edit");
            expect(editMenuItem).toBeDefined();
            await editMenuItem.click();
            const editAction = await editActionPromise;
            expect(editAction.name).toEqual("edit");

            await page.waitForSelector("#" + menuId, { timeout: 1000, hidden: true });

            expect(await menu.isIntersectingViewport()).toEqual(false);

            await menuButton.click();
            const newMenu = await page.waitForSelector("#" + menuId, { timeout: 1000, visible: true });

            const deleteMenuItem = await findEntryMatching<HTMLElement>(await newMenu.$$("[role=menuitem]"), "comments/Comment/delete");

            expect(deleteMenuItem).toBeDefined();

            await deleteMenuItem.click();

            expect((await deleteActionPromise).name).toEqual("delete");

            await page.waitForSelector("#" + menuId, { timeout: 1000, hidden: true });

            expect(await menu.isIntersectingViewport()).toEqual(false);

            stopIntercept(page);
        },
    },
};

export const withHTML = () => <Comment
    comment={{
        author: "C. Norris",
        date: new Date("2020-04-01T00:00:00.000Z"),
        body: "<p>This comment has some</p><p style='color: red'><b>HTML</b> content</p>",
    }}
/>;
