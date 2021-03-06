import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { makeDecorator } from '@storybook/addons';
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { createElement, Suspense } from 'react';

addDecorator(withKnobs);

addDecorator(makeDecorator({
    name: "withI18nextProvider",
    wrapper: (getStory, context) => {
        const i18nInstance = i18n.createInstance({
            lng: 'cimode',
            debug: true,
            resources: {
            }
        });
        i18nInstance.init();
        const story = getStory(context);
        return createElement(I18nextProvider, {
            i18n: i18nInstance,
        }, story);
    }
}));

addDecorator(makeDecorator({
    name: "withSuspense",
    wrapper: (getStory, context) => {
        const story = getStory(context);
        return createElement(Suspense, {
            fallback: createElement("span", {}, "Loading translations..."),
        }, story);
    }
}))
