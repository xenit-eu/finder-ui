
import Badge from "material-ui/Badge";
import { List, ListItem } from "material-ui/List";
import ActionInfo from "material-ui/svg-icons/action/info";
import { createElement as __, DOM as _, ReactElement } from "react";

import "./facets.less";

export type OnFacetSelected_t = (name: string, label: string, value: string) => void;

export type Facet_t = {
    name: string,
    label: string,
    values: Array<{
        count: number,
        label: string,
        value: string,
    }>,
};

type FacetSub_t = {
    facet: Facet_t,
    onFacetSelected: OnFacetSelected_t,
};

function FacetSub({facet, onFacetSelected}: FacetSub_t): ReactElement<any> {
    return __(ListItem, {
        key: facet.name,
        primaryText: facet.label,
        initiallyOpen: false,
        primaryTogglesNestedList: true,
        nestedItems: facet.values.map(c =>
                __(ListItem, {
                    key: c.value,
                    onTouchTap: () => onFacetSelected(facet.name, facet.label, c.value),
                    primaryText: c.label,
                    rightIcon: __(Badge, { className: "badge", badgeContent: c.count }) }),
            ),
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
export function Facets({facets, onFacetSelected}: Facets_t): ReactElement<any> {
    return _.div({className: "facets"},
        __(List, { key: "first" }, facets.filter((k) => k.values.length > 0).map((facet) => FacetSub({ facet, onFacetSelected }))),
    );
}
