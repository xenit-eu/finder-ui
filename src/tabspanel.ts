import { Tab, Tabs } from "material-ui/Tabs";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";

import "./tabspanel.less";

export type TabPanel_t = {
    label: string,
    name: string,
    content: ReactElement<any>;
};

export type TabsPanelOnChange_t = (value: string, event: any, tab: Tab) => void;

export type TabsPanel_t = {
    tabsInfo: TabPanel_t[],
    onchange: TabsPanelOnChange_t,
    selectedPanel: string,
    style?: TabsPanelStyle_t,
};

export type TabsPanelStyle_t = {
    styleContent?: any,
    styleContentcssKey?: string,
    styleTabs?: any,
    inkBarStyle?: any,
};

export const TabsPanel = ({ tabsInfo, onchange, selectedPanel, style = {} }: TabsPanel_t) => {
    const tabChildren = tabsInfo.map((p, i) => __(Tab, { style: style.styleTabs, label: p.label, value: name, key: i }, p.content));
    let index = tabsInfo.map((p) => p.name).indexOf(selectedPanel);
    let cssKeycontent = style.styleContentcssKey ? style.styleContentcssKey : "tabspanel";
    const tabs = __(Tabs, {
        onChange: onchange,
        inkBarStyle: style.inkBarStyle ? style.inkBarStyle : {},
        style: style.styleContent,
        key: style.styleContentcssKey,
        className: cssKeycontent + " " + (true ? "open" : ""),
        initialSelectedIndex: index,
    }, tabChildren);
    return tabs;
};
