import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { boolean, select } from "@storybook/addon-knobs";
import * as React from "react";
import ButtonWithIcon from "./ButtonWithIcon";
export default {
    title: "button/ButtonWithIcon",
    component: ButtonWithIcon,
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

        module.exports[buttonVariantName + buttonSizeName] = () => <>
            <ButtonWithIcon
                style={{ outline: "1px solid red" }}
                icon={<SaveIcon />}
                variant={select("variant", buttonVariants, buttonVariant)}
                size={select("size", buttonSizes, buttonSize)}
            >Click me (with icon)</ButtonWithIcon>
            <Button
                style={{ outline: "1px solid red" }}
                variant={select("variant", buttonVariants, buttonVariant)}
                size={select("size", buttonSizes, buttonSize)}
            >Click me (without icon)</Button>
        </>;
    }
}
