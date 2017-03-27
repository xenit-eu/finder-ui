
import Badge from "material-ui/Badge";
import { List, ListItem } from "material-ui/List";
import ActionInfo from "material-ui/svg-icons/action/info";
import { createElement as __, DOM as _, ReactElement } from "react";

import "./facets.less";

export type OnFacetSelected = (name: string, label: string, value: string) => void;

export type Facet_t = {
    name: string,
    label: string,
    values: Array<{
        count: number,
        label: string,
        value: string,
    }>,
};

type facetSub_t = {
    facet: Facet_t,
    onFacetSelected: OnFacetSelected,
};

function FacetSub({facet, onFacetSelected}: facetSub_t): ReactElement<any> {
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

export type Facets_t = {
    facets: Facet_t[],
    onFacetSelected: OnFacetSelected,
};

export function Facets({facets, onFacetSelected}: Facets_t): ReactElement<any> {
    return _.div({className: "facets"},
        __(List, { key: "first" }, facets.filter((k) => k.values.length > 0).map((facet) => FacetSub({ facet, onFacetSelected }))),
    );
}
