import initStoryshots from "@storybook/addon-storyshots";
import { puppeteerTest } from "@storybook/addon-storyshots-puppeteer";
import { resolve } from "path";
import { Page } from "puppeteer";
import { stopIntercept } from "../src/puppeteerActionInterceptor";

const storybookUrl = "file://" + resolve(__dirname, "../storybook-static");

initStoryshots({
    test: puppeteerTest({
        storybookUrl,
        customizePage: async (page: Page) => {
            stopIntercept(page)
        }
    }),
});
