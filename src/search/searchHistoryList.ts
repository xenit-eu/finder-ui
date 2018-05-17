import Avatar from "material-ui/Avatar";
import { List, ListItem } from "material-ui/List";
import ActionSearch from "material-ui/svg-icons/action/search";
import { Component, createElement as __, DOM as _, ReactElement, SyntheticEvent } from "react";

let iconsize = 30;
let avatarSearch = __(Avatar, { size: iconsize, icon: __(ActionSearch, {}) });

export function GetPreviousSearches(
    translate: any,
    previousSearches: any[],
    doSearch: (query: any) => void) {
    return previousSearches.map((previousSearch: any, i: any) => {
        let label = previousSearch.GetDescriptionText(translate);
        let ret = __(ListItem, {
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
