
import { mount, shallow } from 'enzyme';
import { DOM as _, createElement as __, Component } from 'react';
import { Facets, Facets_t } from './facets';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { TestWrapper, simulateEvent } from './testUtils';


const muiTheme = getMuiTheme();


const case1: Facets_t = {
    facets: [
        {
            name: "F1",
            label: "Facet1",
            values: [
                { count: 3, label: "Label1", value: "V1" },
                { count: 9, label: "Label2", value: "V2" },
            ]
        },
    ],
    onFacetSelected: (name, value) => console.log(name, value)
};

describe('Facets test', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });

    it('should display 2 nested Lists with corresponding ListItems',  () => {

        const wrapper = shallow(__(Facets, case1));
        //console.log(wrapper.debug());

        const list = wrapper.find('List');
        expect(list.find('ListItem').length).toBe(case1.facets.length);

        const topListItem = list.find('ListItem');

        expect(topListItem.prop('primaryText')).toBe(case1.facets[0].label);

        const subListItems = topListItem.prop('nestedItems').map(c => mount(c, { context: { muiTheme: muiTheme } }));
        expect(subListItems.length).toBe(case1.facets[0].values.length);

        // check value of sub-items labels.
        expect(subListItems.map(a => a.prop('primaryText'))).toEqual(case1.facets[0].values.map(a => a.label));

        // check value of badges (counts)
        expect(subListItems.map(a => a.find('Badge').text())).toEqual(case1.facets[0].values.map(a => a.count.toString()));

    });

    it('should call callback function when facet value clicked', () => {

        spyOn(case1, "onFacetSelected");

        const wrapper = shallow(__(Facets, case1));
        const topListItem = wrapper.find('ListItem');
        const subListItems = topListItem.prop('nestedItems').map(c => mount(c, { context: { muiTheme: muiTheme } }));

        //subListItems[1].simulate('touchTap');  // doesn't work !
        //console.log(subListItems[1].debug());   
        simulateEvent(subListItems[1].find('EnhancedButton'), 'touchTap');

        expect(case1.onFacetSelected).toHaveBeenCalledWith("F1", "V2");

    });

});

