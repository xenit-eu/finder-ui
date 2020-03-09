function intercept(page: any, func: (actionObj: object) => void) {
    page.on("console", async (msg: any) => {
        if (msg.type() === "debug") {
            const arg1 = await unwrapJSHandle(msg.args()[0]);
            const arg2 = await unwrapJSHandle(msg.args()[1]);
            if (arg1 === "message arrived at preview" && arg2 === "storybook/actions/action-event") {
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

export function interceptAction(page: any, actionName: string): Promise<{ name: string, args: any[]}> {
    return interceptWrapper(page, (actionObj: any) => actionObj.data.name === actionName)
    .then((actionObj: any) => actionObj.data);
}

async function interceptWrapper(page: any, filter: (actionObj: object) => boolean) {
    return new Promise((resolve) => filteredIntercept(page, filter, resolve));
}

export function stopIntercept(page: any) {
    page.removeAllListeners("console");
}
