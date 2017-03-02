import { createElement as __, Component, DOM as _, ReactElement } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';


export type TabPanel_t = {
    label: string,
    name: string,
    content: ReactElement<any>;
}
export type TabsPanelOnChange_t = (value: string, event: any, tab: Tab) => void;

export type TabsPanel_t = {
    tabsInfo: TabPanel_t[], 
    onchange: TabsPanelOnChange_t, 
    selectedPanel: string, 
    key: string,
    className: string,
};

export const TabsPanel = ({tabsInfo, onchange, selectedPanel, key, className} : TabsPanel_t) => {
    const tabChildren = tabsInfo.map((p, i) => __(Tab, { label: p.label, value: name, key: i }, p.content));
    let index = tabsInfo.map(p => p.name).indexOf(selectedPanel);
    const tabs = __(Tabs, {
                onChange: onchange,
            initialSelectedIndex: index,
        }, tabChildren);
    return _.div({ key: key, className: className }, tabs);
}