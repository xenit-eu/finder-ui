import { createElement as __, Component, DOM as _, ReactElement } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
export type paneltab = {
    label: string,
    name: string,
    content: ReactElement<any>;
}
export type TabsPanelOnChange_t = (value: string, event: any, tab: Tab) => void;

export const TabsPanel = (tabsInfo: paneltab[], onchange: TabsPanelOnChange_t, selectedPanel: string, cssKey: string) => {
    const tabChildren = tabsInfo.map((p, i) => __(Tab, { label: p.label, value: name, key: i }, p.content));
    let index = tabsInfo.map(p => p.name).indexOf(selectedPanel);
    const tabs = __(Tabs,
        {
            onChange: onchange,
            initialSelectedIndex: index,
        }, tabChildren);
    return _.div({ key: cssKey, className: 'right ' + (true ? 'open' : '') }, tabs);
}