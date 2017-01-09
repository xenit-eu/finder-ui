
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { DOM as _, createElement as __, Component, ReactElement } from 'react';
import { DocumentTree, DocumentTreeNode_t } from './treeview';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent, TestWrapper } from './testUtils';

const muiTheme = getMuiTheme();
const childLower = { open: true, Toggle: () => { }, text: "ChildBottom", children: [] }
const childLow = { open: true, Toggle: () => { }, text: "Child", children: [childLower]}
const case1: DocumentTreeNode_t = { open: true, Toggle: () => { }, text: "Parent", children: [childLow, childLower] };

describe('Treeview test', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    it('should display nested items', () => {
        const wrapper = Fixture(__(DocumentTree, case1));
        let list = wrapper; 
        const topListItems = list.find('ListItem');
        expect(topListItems.get(0).props["primaryText"]).toBe("Parent");
        const subItems = topListItems.at(0).prop("nestedItems").map((c : ReactElement<any>) => Fixture(c, { context: { muiTheme: muiTheme } }));
        const subItem = subItems[0].find("ListItem").at(0); 
        expect(subItem.prop("primaryText")).toBe("Child");
    });
});