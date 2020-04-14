import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import { resolve } from "path";

const storybookUrl = "file://" + resolve(__dirname, "../storybook-static");

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
            }).then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            });
        },
    }),
});
