
import Badge from "material-ui/Badge";
import { List, ListItem } from "material-ui/List";
import ActionInfo from "material-ui/svg-icons/action/info";
import { createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";

import "./facets.less";
import { IDateRange } from "./search";
import { DocumentSizeRange_t } from "./documentSize";

//In case later on other ranges are used, we can generalize the type. For now, document size range should be fine.
export type Facet_Value_t = string | IDateRange | DocumentSizeRange_t;
export type OnFacetSelected_t = (name: string, label: string, value: Facet_Value_t, valueLabel: string) => void;
function facetValueToKeyString(value: Facet_Value_t) {
    return value.toString();
}

export type Facet_t = {
    name: string,
    label: string,
    secondaryLabel?: string,
    values: Array<{
        count: number,
        label: string,
        value: Facet_Value_t,
    }>,
};

type FacetSub_t = {
    facet: Facet_t,
    onFacetSelected: OnFacetSelected_t,
};

function FacetSub({ facet, onFacetSelected }: FacetSub_t): ReactElement<any> {
    const nestedItems = facet.values.map(c => {
        const key = facetValueToKeyString(c.value) + c.label;
        return __(ListItem, {
            key,
            onClick: () => onFacetSelected(facet.name, facet.label, c.value, c.label),
            primaryText: c.label,
            rightIcon: __(Badge, { className: "badge", badgeContent: c.count }),
        });
    },
    );
    return __(ListItem, {
        key: facet.name,
        primaryText: facet.label,
        secondaryText: facet.secondaryLabel,
        initiallyOpen: false,
        primaryTogglesNestedList: true,
        nestedItems,
    });
}

/* #### facets data structure

| Key    | Description                             |
|--------------|-----------                                |
| name | internal name of the facet |
| label | displayable name of the facet |
| values | each facet can have a list of values and for each of value we have: count (number of nodes for this facet value), value (value of the facet), label (displayable text for the value) |

 */
export type Facets_t = {
    facets: Facet_t[],
    onFacetSelected: OnFacetSelected_t,
};

//@Component Facets
//@ComponentDescription "Display alfresco facets in a hierarchical manner."
//@Method Facets
//@MethodDescription "Facets({param1: value1, param2: value2, ...})"
//@Param facets     Facet_t[] "facets data to be displayed (see below for more details)"
//@Param onFacetSelected OnFacetSelected_t "callback called when a specific facet value has been clicked"
export function Facets({ facets, onFacetSelected }: Facets_t): ReactElement<any> {
    return _.div({ className: "facets" },
        __(List, { key: "first" }, facets.filter((k) => k.values.length > 0).map((facet) => FacetSub({ facet, onFacetSelected }))),
    );
}
