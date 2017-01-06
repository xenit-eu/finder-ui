
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { DOM as _, createElement as __, Component, ReactElement } from 'react';
import { Treeview_t, TreeviewElement } from './treeview';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { TestWrapper, simulateEvent } from './testUtils';

const muiTheme = getMuiTheme();
const childLower = { label: "ChildBottom" };
const childLow = { label: "Sub Child", children: [childLower] };
const childHigh = { label: "Child", children: [childLow, childLower] };
const case1: Treeview_t = {
    label: "Explorer",
    children: [childHigh, childHigh, childLow]
}

describe('Treeview test', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    it('should display nested items', () => {

        const wrapper = shallow(__(TreeviewElement, case1));

        const title = wrapper.childAt(0).text();
        expect(title).toBe("Explorer");
    });
});