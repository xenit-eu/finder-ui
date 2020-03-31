import { boolean, select } from "@storybook/addon-knobs";
import * as React from "react";
import ButtonWithProgress from "./ButtonWithProgress";
export default {
    title: "button/ButtonWithProgress",
    component: ButtonWithProgress,
};

const buttonVariants = {
    Text: "text",
    Outlined: "outlined",
    Contained: "contained",
};

const buttonSizes = {
    Large: "large",
    Medium: "medium",
    Small: "small",
};

for (const buttonVariantName of Object.keys(buttonVariants)) {
    const buttonVariant = buttonVariants[buttonVariantName];
    for (const buttonSizeName of Object.keys(buttonSizes)) {
        const buttonSize = buttonSizes[buttonSizeName];

        module.exports[buttonVariantName + buttonSizeName] = () => <ButtonWithProgress
            isLoading={boolean("isLoading", true) ? { progress: 50 } : false}
            variant={select("variant", buttonVariants, buttonVariant)}
            size={select("size", buttonSizes, buttonSize)}
        >Click me</ButtonWithProgress>;
    }
}
