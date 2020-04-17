import { ElementHandle, Page } from "puppeteer";
import * as React from "react";
import SnackbarManager, { SnackbarManager_Message_t } from "./SnackbarManager";

export default {
    title: "snackbar/SnackbarManager",
    component: SnackbarManager,
};

function InteractiveSnackbarManager() {
    const [messages, setMessages] = React.useState([] as SnackbarManager_Message_t[]);
    return <>
        <button onClick={() => setMessages(messages.concat([{
            type: "error",
            message: "An error message that doesn't expire.",
            expires: false,
        }]))}>Put nonexpiring error</button>
        <button onClick={() => setMessages(messages.concat([{
            type: "info",
            message: "An info message",
            expires: true,
        }]))}>Put info message</button>
        <SnackbarManager
            messages={messages}
            onMessageExpired={(message) => setMessages(messages.filter((m) => m !== message))}
        />
    </>;
}

export const interactive = () => <InteractiveSnackbarManager />;

interactive.story = {
    parameters: {
        storyshots: { disable: true },
    },
};

function DelayedSnackbarManager(props: any) {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    });

    return <SnackbarManager {...props} messages={visible ? props.messages : []} />;

}

export const withUnexpiringError = () => <DelayedSnackbarManager
    messages={[
        {
            type: "error",
            message: "An error message that doesn't expire",
            expires: false,
        },
        {
            type: "info",
            message: "You dismissed the error message!",
            expires: true,
        },
    ]}
/>;

async function getAttribute(element: ElementHandle, attribute: string): Promise<string | null> {
    const attr = await element.$x("./@" + attribute);
    if (attr.length !== 1) {
        return null;
    }
    const property = await attr[0].getProperty("value");
    return await property.jsonValue() as string;
}

withUnexpiringError.story = {
    parameters: {
        storyshots: { disable: true },
        async puppeteerTest(page: Page) {
            // Wait for notification to appear
            const notification = await page.waitForSelector("[id^='snackbar-SnackbarNotification']");
            const notificationId = await getAttribute(notification, "id");
            const notificationContent = await notification.evaluate((e: HTMLElement) => e.innerText);

            // Close notification
            const closeButton = await page.$("button[aria-label='snackbar/SnackbarNotification/close']");
            await closeButton.click();
            await page.waitForFunction("document.getElementById('" + notificationId + "') === null");

            // Expect next notification to appear
            const newNotification = await page.waitForSelector("[id^='snackbar-SnackbarNotification']");
            const newNotificationId = await getAttribute(newNotification, "id");
            const newNotificationContent = await newNotification.evaluate((e: HTMLElement) => e.innerText);

            expect(newNotificationId).not.toEqual(notificationId);
            expect(newNotificationContent).not.toEqual(notificationContent);
        },
    },
};

export const withUnexpiringErrorTrace = () => <DelayedSnackbarManager
    messages={[
        {
            type: "error",
            message: "An error message with a trace",
            trace: new Error().stack,
        },
        {
            type: "info",
            message: "You dismissed the error message!",
            expires: true,
        },
    ]}
/>;

async function findEntryMatching<E extends HTMLElement>(elements: Array<ElementHandle<E>>, content: string): Promise<ElementHandle<E> | null> {
    const entriesMatches = await Promise.all(elements.map((elem) => elem.evaluate((browserElem, browserContent) => browserElem.innerText === browserContent, content)));
    const firstIndex = entriesMatches.indexOf(true);
    if (firstIndex === -1) {
        return null;
    }
    return elements[firstIndex];
}

withUnexpiringErrorTrace.story = {
    parameters: {
        storyshots: { disable: true },
        async puppeteerTest(page: Page) {
            // Wait for notification to appear
            const notification = await page.waitForSelector("[id^='snackbar-SnackbarNotification']");
            const notificationId = await getAttribute(notification, "id");
            const notificationContent = await notification.evaluate((e: HTMLElement) => e.innerText);

            // Click trace button
            const traceButton = await page.$("button[aria-label='snackbar/SnackbarNotification/trace']");
            await traceButton.click();

            // Wait for trace dialog to appear
            await page.waitForFunction("document.getElementById('" + notificationId + "') === null");
            const dialog = await page.waitForSelector("[role='dialog']");

            // Close trace dialog
            const dialogButtons = await dialog.$$("button");
            const dialogCloseButton = await findEntryMatching(dialogButtons, "CLOSE");
            await dialogCloseButton.click();

            // Wait for notification to reappear
            const reappearedNotification = await page.waitForSelector("[id^='snackbar-SnackbarNotification']");
            const reappearedNotificationId = await getAttribute(reappearedNotification, "id");
            expect(await reappearedNotification.evaluate((e: HTMLElement) => e.innerText)).toEqual(notificationContent);

            // Close the notification
            const closeButton = await page.$("button[aria-label='snackbar/SnackbarNotification/close']");
            await closeButton.click();
            await page.waitForFunction("document.getElementById('" + reappearedNotificationId + "') === null");

            // Expect next notification to appear
            const newNotification = await page.waitForSelector("[id^='snackbar-SnackbarNotification']");

            const newNotificationId = await getAttribute(newNotification, "id");
            expect(newNotificationId).not.toEqual(reappearedNotificationId);
            expect(await newNotification.evaluate((e: HTMLElement) => e.innerText)).not.toEqual(notificationContent);
        },
    },
};
