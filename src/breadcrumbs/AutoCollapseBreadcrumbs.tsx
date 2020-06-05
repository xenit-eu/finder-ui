import { withStyles, WithStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import classnames from "classnames";
import debug from "debug";
import React, { useLayoutEffect, useReducer, useRef } from "react";
import { SizeMe, withSize } from "react-sizeme";
import invariant from "tiny-invariant";
import { Breadcrumbs_Props_t } from "./Breadcrumbs";
import Breadcrumbs from "./Breadcrumbs";
import generateAutoCollapseParameters, { GenerateAutoCollapseParameters_t, GenerateAutoCollapseParametersOutput_t } from "./generateAutoCollapseParameters";

const d = debug("finder-ui:breadcrumbs:AutoCollapseBreadcrumbs");

type AutoCollapseBreadcrumbs_Props_t = Pick<Breadcrumbs_Props_t, Exclude<keyof Breadcrumbs_Props_t, keyof GenerateAutoCollapseParameters_t>> &
    Pick<GenerateAutoCollapseParameters_t, Exclude<keyof GenerateAutoCollapseParameters_t, "size">>;

type BreadcrumbsParameters_t = GenerateAutoCollapseParametersOutput_t & {
    width: number,
};

type ReceiveParametersAction_t = {
    type: "reset",
} | {
    type: "receive",
    parameters: BreadcrumbsParameters_t,
};

export default function AutoCollapseBreadcrumbs({ itemsBeforeCollapse, itemsAfterCollapse, maxItems, ...parentProps }: AutoCollapseBreadcrumbs_Props_t) {

    const [breadcrumbsParameters, receiveParameters] = useReducer((state: BreadcrumbsParameters_t[], action: ReceiveParametersAction_t) => {
        d("Received parameters %o", action);
        switch (action.type) {
            case "receive":
                return state.filter((p) => p.priority !== action.parameters.priority)
                    .concat([action.parameters])
                    .sort((a, b) => b.priority - a.priority);
            case "reset":
                return [];
            default:
                invariant(false);
        }
    }, []);

    // Use useLayoutEffect, because that runs before children are rendered,
    // and thus before the children have sent their results
    useLayoutEffect(() => {
        receiveParameters({ type: "reset" });
    }, [parentProps.children]);

    const previousConfig = useRef<GenerateAutoCollapseParametersOutput_t>();

    const size = React.Children.count(parentProps.children);

    const autocollapseParameters = generateAutoCollapseParameters({
        size,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        maxItems,
    });

    return <SizeMe monitorWidth noPlaceholder>{({ size: { width: fullWidth } }) => {
        const parametersComplete = breadcrumbsParameters.length === autocollapseParameters.length;
        d("fullWidth=%o parametersComplete=%o", fullWidth, parametersComplete);

        let parametersToUse = previousConfig.current;
        if (autocollapseParameters.length === 1) {
            // There is only one option here, no need to do test renders, just pick this option
            parametersToUse = autocollapseParameters[0];
            d("Using only option for parameters %O", parametersToUse);
        } else if (fullWidth && parametersComplete) {
            // Take the one that just matches the width, or the one that is the last one in the list if nothing fits (least priority and probably smallest size)
            parametersToUse = breadcrumbsParameters.find((p) => p.width < fullWidth) || breadcrumbsParameters[breadcrumbsParameters.length - 1];
            d("Width of container: %O", fullWidth);
            d("Selected parameters %O from list %O", parametersToUse, breadcrumbsParameters);
        } else {
            d("Reusing previous configuration %O", parametersToUse);
        }
        previousConfig.current = parametersToUse;

        return <div>
            {autocollapseParameters.length > 1 && <OffscreenRender>
                {autocollapseParameters.map((parameters, i) => <BreadcrumbsTestRender
                    key={i}
                    parameters={parameters}
                    children={parentProps.children}
                    onResult={(params, width) => receiveParameters({ type: "receive", parameters: { ...params, width } })}
                />)}
            </OffscreenRender>}
            {parametersToUse && <Breadcrumbs
                {...parametersToUse.output}
                {...parentProps}
            />}
        </div>;
    }}</SizeMe>;

}

const BreadcrumbsWithWidth = withSize({ monitorWidth: true, noPlaceholder: true })(Breadcrumbs);

type BreadcrumbsTestRender_Props_t = {
    parameters: GenerateAutoCollapseParametersOutput_t
    children: React.ReactNode,
    onResult: (parameters: GenerateAutoCollapseParametersOutput_t, width: number) => void,
};

function BreadcrumbsTestRender(props: BreadcrumbsTestRender_Props_t) {
    return <BreadcrumbsWithWidth
        _measureOnly={true}
        children={props.children}
        {...props.parameters.output}
        onSize={({ width }) => {
            if (width !== null) {
                props.onResult(props.parameters, width);
            }
        }}
    />;
}

const offscreenRenderStyle = {
    root: {
        position: "absolute",
        left: "-9999px",
    } as CSSProperties,
    rootDebug: {
        left: "0",
        top: "50%",
        outline: "1px dotted red",
        opacity: 0.5,
    },
    item: {

    },
    itemDebug: {
        outline: "1px dotted pink",
    },
};

type OffscreenRender_Props_t = {
    children: React.ReactNode,
};

function OffscreenRender_(props: OffscreenRender_Props_t & WithStyles<typeof offscreenRenderStyle>) {
    const showDebug = d.extend("overlay").enabled;
    return <div className={classnames(props.classes.root, {
        [props.classes.rootDebug]: showDebug,
    })}>
        {React.Children.map(props.children, (c) => <div className={classnames(props.classes.item, {
            [props.classes.itemDebug]: showDebug,
        })}>{c}</div>)}
    </div>;
}

const OffscreenRender = withStyles(offscreenRenderStyle)(OffscreenRender_);
