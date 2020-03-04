import initStoryshots from "@storybook/addon-storyshots";
import { puppeteerTest, imageSnapshot } from "@storybook/addon-storyshots-puppeteer";

initStoryshots({
    test: puppeteerTest(),
});

initStoryshots({

    suite: "Image storyshots",
    test: imageSnapshot(),
});
