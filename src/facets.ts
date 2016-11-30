
import { DOM as _, createElement as __, ReactElement } from 'react';
import { List, ListItem } from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Badge from 'material-ui/Badge';

export type Facet_t = { name: string, label: string, values: { count: number, label: string, value: string }[] };

type facetSub_t = { 
    facet: Facet_t, 
    onFacetSelected: (name: string, value: string) => void 
};

function FacetSub({facet, onFacetSelected}: facetSub_t) : ReactElement<any> {
    return __(ListItem, {
        key: facet.name,
        primaryText: facet.label,
        initiallyOpen: false,
        primaryTogglesNestedList: true,
        nestedItems: facet.values.map(c => __(ListItem, { key: c.value, onTouchTap: () => onFacetSelected(facet.name, c.value), primaryText: c.label, rightIcon: __(Badge, { badgeContent: c.count }) }))
    });
}

export type Facets_t = { 
    facets: Facet_t[], 
    onFacetSelected: (name: string, value: string) => void 
};

export function Facets({facets, onFacetSelected}: Facets_t) : ReactElement<any> {
    return _.div({}, [
        __(List, { key: "first" }, facets.filter(k => k.values.length).map(facet => FacetSub({ facet: facet, onFacetSelected: onFacetSelected })))
    ]);
}

