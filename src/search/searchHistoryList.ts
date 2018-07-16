import Avatar from "material-ui/Avatar";
import { List, ListItem } from "material-ui/List";
import ActionSearch from "material-ui/svg-icons/action/search";
import { Component, createElement as __, ReactElement, SyntheticEvent } from "react";
import * as _ from "react-dom-factories";

const iconsize = 30;
const avatarSearch = __(Avatar, { size: iconsize, icon: __(ActionSearch, {}) });

export function GetPreviousSearches(
    translate: any,
    previousSearches: any[],
    doSearch: (query: any) => void) {
    return previousSearches.map((previousSearch: any, i: any) => {
        const label = previousSearch.GetDescriptionText(translate);
        const ret = __(ListItem, {
            onClick: () => {
                doSearch(previousSearch);
            },
            leftAvatar: avatarSearch,
            primaryText: label,
            key: i,
        });
        return ret;
    });
}
