import { withStyles, WithStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import classnames from "classnames";
import debug from "debug";
import React, { ReactElement, useReducer } from "react";
import { SizeMe, withSize } from "react-sizeme";
import generateAutoCollapseParameters, { AutoCollapseParameters_t, GenerateParametersOutput_t } from "./autocollapseparameters";
import { Breadcrumbs_Props_t } from "./Breadcrumbs";
import Breadcrumbs from "./Breadcrumbs";

const d = debug("finder-ui:breadcrumbs:AutoCollapseBreadcrumbs");

type AutoCollapseBreadcrumbs_Props_t = Breadcrumbs_Props_t & Pick<AutoCollapseParameters_t, Exclude<keyof AutoCollapseParameters_t, "size">>;

type BreadcrumbsParameters_t = GenerateParametersOutput_t & {
    width: number,
};

export default function AutoCollapseBreadcrumbs({ itemsBeforeCollapse, itemsAfterCollapse, maxItems, ...parentProps }: AutoCollapseBreadcrumbs_Props_t) {

    const [breadcrumbsParameters, receiveParameters] = useReducer((state: BreadcrumbsParameters_t[], action: BreadcrumbsParameters_t) => {
        d("Received parameters %o", action);
        return state.concat([action]).sort((a, b) => b.priority - a.priority);
    }, []);

    const size = React.Children.count(parentProps.children);

    const autocollapseParameters = generateAutoCollapseParameters({
        size,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        maxItems,
    });

    return <SizeMe monitorWidth>{({ size: { width: fullWidth } }) => {

        // Take the one that just matches the width, or the one that is the last one in the list if nothing fits (least priority and probably smallest size)
        const parametersToUse = fullWidth ? breadcrumbsParameters.find((p) => p.width < fullWidth) || breadcrumbsParameters[breadcrumbsParameters.length - 1] : null;

        return <div>
            <OffscreenRender>
                {autocollapseParameters.map((parameters, i) => <BreadcrumbsTestRender
                    key={i}
                    parameters={parameters}
                    children={parentProps.children}
                    onResult={(params, width) => receiveParameters({ ...params, width })}
                />)}
            </OffscreenRender>
            {parametersToUse && <Breadcrumbs
                {...parametersToUse.output}
                {...parentProps}
            />}
        </div>;
    }}</SizeMe>;

}

const BreadcrumbsWithWidth = withSize({ monitorWidth: true, noPlaceholder: true })(Breadcrumbs);

type BreadcrumbsTestRender_Props_t = {
    parameters: GenerateParametersOutput_t
    children: React.ReactNode,
    onResult: (parameters: GenerateParametersOutput_t, width: number) => void,
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
    return <div className={classnames(props.classes.root, {
        [props.classes.rootDebug]: d.enabled,
    })}>
        {React.Children.map(props.children, (c) => <div className={classnames(props.classes.item, {
            [props.classes.itemDebug]: d.enabled,
        })}>{c}</div>)}
    </div>;
}

const OffscreenRender = withStyles(offscreenRenderStyle)(OffscreenRender_);
