function intercept(page: any, func: (actionObj: object) => void) {
    page.on("console", async (msg: any) => {
        if (msg.type() === "debug") {
            const text: string = msg.text();
            if (text.includes("message arrived at preview storybook/actions/action-event")) {
                func(await unwrapJSHandle(msg.args()[2]));
            }
        }
    });
}

function unwrapJSHandle(handle: any) {
    return handle.evaluate((x: any) => x);
}

function filteredIntercept(page: any, filter: (actionObj: object) => boolean, func: (actionObj: object) => void) {
    intercept(page, (actionObj) => {
        if (filter(actionObj)) {
            func(actionObj);
        }
    });
}

export function interceptAction(page: any, actionName: string): Promise<{ name: string, args: any[] }> {
    return interceptWrapper(page, (actionObj: any) => actionObj.data.name === actionName)
        .then((actionObj: any) => actionObj.data);
}

async function interceptWrapper(page: any, filter: (actionObj: object) => boolean) {
    return new Promise((resolve) => filteredIntercept(page, filter, resolve));
}

export function stopIntercept(page: any) {
    page.removeAllListeners("console");
}

async function interceptCustomMessage(page: any, customMsg: string): Promise<string> {
    return new Promise((resolve) => {
        page.on("console", async (msg: any) => {
            if (msg.type() === "debug" && msg.args().length >= 2) {
                const arg1 = await unwrapJSHandle(msg.args()[0]);
                const arg2 = await unwrapJSHandle(msg.args()[1]);
                if (arg1 === "custom message" && arg2 === customMsg) {
                    resolve(arg2);
                }
            }
        });
    });
}

export async function raceActionWithCustomMessage(page: any, actionName: string, customMsg: string) {
    return Promise.race([
        interceptAction(page, actionName),
        interceptCustomMessage(page, customMsg),
    ]);
}

export async function sendCustomMessage(page: any, customMsg: string) {
    // tslint:disable-next-line:no-console
    return page.evaluate((msg: string) => console.debug("custom message", msg), customMsg);
}
