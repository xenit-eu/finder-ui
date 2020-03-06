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
    }),
});
