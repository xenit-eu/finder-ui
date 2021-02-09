import type { JSHandle, Page } from "puppeteer";
import { v4 as uuidv4 } from "uuid";
function intercept(page: Page, func: (actionObj: object) => void) {
    page.evaluate(() => {
        (window as any).__STORYBOOK_ADDONS_CHANNEL__.on("storybook/actions/action-event", console.debug.bind(console, "message arrived at preview storybook/actions/action-event"));
    });
    page.on("console", async (msg) => {
        if (msg.type() === "debug") {
            const text: string = msg.text();
            if (text.includes("message arrived at preview storybook/actions/action-event")) {
                const dataObject = await unwrapJSHandle(msg.args()[1]) as object;
                func(dataObject);
            }
        }
    });
}

async function unwrapJSHandle<T>(handle: JSHandle<T>): Promise<T> {
    return JSON.parse(await handle.evaluate((x: T) => JSON.stringify(x))) as Promise<T>;
}

function filteredIntercept(page: Page, filter: (actionObj: object) => boolean, func: (actionObj: object) => void) {
    intercept(page, (actionObj) => {
        if (filter(actionObj)) {
            func(actionObj);
        }
    });
}

export function interceptAction(page: Page, actionName: string): Promise<{ name: string, args: any[] }> {
    return interceptWrapper(page, (actionObj: any) => actionObj.data.name === actionName)
        .then((actionObj: any) => actionObj.data);
}

async function interceptWrapper(page: Page, filter: (actionObj: object) => boolean) {
    return new Promise((resolve) => filteredIntercept(page, filter, resolve));
}

export function stopIntercept(page: Page) {
    page.removeAllListeners("console");
}

const customMessageUuid = uuidv4();

async function interceptCustomMessage(page: Page, customMsg: string): Promise<string> {
    return new Promise((resolve) => {
        page.on("console", async (msg: any) => {
            if (msg.type() === "debug" && msg.args().length >= 2) {
                const arg1 = await unwrapJSHandle(msg.args()[0]);
                const arg2 = await unwrapJSHandle(msg.args()[1]);
                if (arg1 === customMessageUuid && arg2 === customMsg) {
                    resolve(arg2);
                }
            }
        });
    });
}

export async function raceActionWithCustomMessage(page: Page, actionName: string, customMsg: string) {
    return Promise.race([
        interceptAction(page, actionName),
        interceptCustomMessage(page, customMsg),
    ]);
}

export async function sendCustomMessage(page: Page, customMsg: string) {
    // tslint:disable-next-line:no-console
    return page.evaluate((messageUuid, msg) => console.debug(messageUuid, msg), customMessageUuid, customMsg);
}
