import initStoryshots from "@storybook/addon-storyshots";
import { puppeteerTest } from "@storybook/addon-storyshots-puppeteer";
import { resolve } from "path";
import { Page } from "puppeteer";
import { stopIntercept } from "../src/__tests/puppeteerActionInterceptor";

const storybookUrl = "file://" + resolve(__dirname, "../storybook-static");

initStoryshots({
    test: puppeteerTest({
        storybookUrl,
        customizePage: async (page: Page) => {
            page.setDefaultTimeout(10000);
            stopIntercept(page)
        }
    }),
});
