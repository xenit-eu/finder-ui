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

const ButtonWithVariantSizeAndLoading = ({ size, variant, loading }) => <ButtonWithProgress
            isLoading={boolean("isLoading", loading) ? { progress: 50 } : false}
            variant={select("variant", buttonVariants, variant)}
            size={select("size", buttonSizes, size)}
        >Click me</ButtonWithProgress>;

export const textLarge = () => <ButtonWithVariantSizeAndLoading variant="text" size="large" loading={false} />;
export const outlinedLarge = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="large" loading={false} />;
export const containedLarge = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="large" loading={false} />;
export const textMedium = () =>  <ButtonWithVariantSizeAndLoading variant="text" size="medium" loading={false} />;
export const outlinedMedium = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="medium" loading={false} />;
export const containedMedium = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="medium" loading={false} />;
export const textSmall = () =>  <ButtonWithVariantSizeAndLoading variant="text" size="small" loading={false} />;
export const outlinedSmall = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="small" loading={false} />;
export const containedSmall = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="small" loading={false} />;

export const textLargeLoading = () => <ButtonWithVariantSizeAndLoading variant="text" size="large" loading={true} />;
export const outlinedLargeLoading = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="large" loading={true} />;
export const containedLargeLoading = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="large" loading={true} />;
export const textMediumLoading = () =>  <ButtonWithVariantSizeAndLoading variant="text" size="medium" loading={true} />;
export const outlinedMediumLoading = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="medium" loading={true} />;
export const containedMediumLoading = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="medium" loading={true} />;
export const textSmallLoading = () =>  <ButtonWithVariantSizeAndLoading variant="text" size="small" loading={true} />;
export const outlinedSmallLoading = () =>  <ButtonWithVariantSizeAndLoading variant="outlined" size="small" loading={true} />;
export const containedSmallLoading = () =>  <ButtonWithVariantSizeAndLoading variant="contained" size="small" loading={true} />;
