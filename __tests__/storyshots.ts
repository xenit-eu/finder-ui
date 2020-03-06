import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot, puppeteerTest } from "@storybook/addon-storyshots-puppeteer";
import { resolve } from "path";

const storybookUrl = "file://" + resolve(__dirname, "../storybook-static");

initStoryshots({
    test: puppeteerTest({
        storybookUrl,
    }),
});


initStoryshots({

    suite: "Image storyshots",
    test: imageSnapshot({
        storybookUrl,
        getMatchOptions: () => ({
            blur: 2,
        }),
        beforeScreenshot: (page) => {
            return new Promise((resolve) => {
                page.once("load", resolve);
                page.evaluate("document.readyState === 'complete'")
                    .then((pageComplete: boolean) => pageComplete && resolve());
            });
        },
    }),
});
