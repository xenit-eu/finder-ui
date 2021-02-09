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

const ButtonWithVariantAndSize = ({ size, variant }) => <>
    <ButtonWithIcon
        style={{ outline: "1px solid red" }}
        icon={<SaveIcon />}
        variant={select("variant", buttonVariants, variant)}
        size={select("size", buttonSizes, size)}
    >Click me (with icon)</ButtonWithIcon>
    <Button
        style={{ outline: "1px solid red" }}
        variant={select("variant", buttonVariants, variant)}
        size={select("size", buttonSizes, size)}
    >Click me (without icon)</Button>
</>;

export const textLarge = () => <ButtonWithVariantAndSize variant="text" size="large" />;
export const outlinedLarge = () =>  <ButtonWithVariantAndSize variant="outlined" size="large" />;
export const containedLarge = () =>  <ButtonWithVariantAndSize variant="contained" size="large" />;
export const textMedium = () =>  <ButtonWithVariantAndSize variant="text" size="medium" />;
export const outlinedMedium = () =>  <ButtonWithVariantAndSize variant="outlined" size="medium" />;
export const containedMedium = () =>  <ButtonWithVariantAndSize variant="contained" size="medium" />;
export const textSmall = () =>  <ButtonWithVariantAndSize variant="text" size="small" />;
export const outlinedSmall = () =>  <ButtonWithVariantAndSize variant="outlined" size="small" />;
export const containedSmall = () =>  <ButtonWithVariantAndSize variant="contained" size="small" />;
