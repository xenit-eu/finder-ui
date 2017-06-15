import { History, SearchQuery, SearchQueryElementKeyValueTranslate } from "finder-services";
import Avatar from "material-ui/Avatar";
import { List, ListItem } from "material-ui/List";
import ActionSearch from "material-ui/svg-icons/action/search";
import { Component, createElement as __, DOM as _, ReactElement, SyntheticEvent } from "react";

let iconsize = 30;
let avatarSearch = __(Avatar, { size: iconsize, icon: __(ActionSearch, {}) });

export function GetPreviousSearches(
    translate: SearchQueryElementKeyValueTranslate,
    previousSearches: History,
    doSearch: (query: SearchQuery) => void) {
    return previousSearches.map((previousSearch, i) => {
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
