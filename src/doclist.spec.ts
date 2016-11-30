
import { mount, shallow } from 'enzyme';
import { DOM as _, createElement as __, Component, PropTypes } from 'react';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent } from './testUtils';

import { DocList, DocList_t, SortDirection_t } from './doclist';
import {Pager_t} from './pager';

const jasmineEnzyme = require('jasmine-enzyme'); // no typings for jasmine-engine => require instead of import.


describe('DocList component tests', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should not display table if no data passed in props', () => {

        const props : DocList_t = {
            columns: [

            ],
            data: [],
            pager: {
                totalItems: 0,
                pageSize: 15,
                selected: 0,
                pageSelected: (page: number) => { }
            },
            rowMenu: [],
            rowSelected: (rowIndex: number) => {}
        };

        //const wrapper = mount(__(TestWrapper, {}, [__(DocList, props)]));
        const wrapper = Fixture(DocList(props));
        
        //console.log(wrapper.debug());

        expect(wrapper.find('table')).toBeEmpty();

    });

    it('should display a table with 2 data row (1 page) when data with 1 col, 2 rows', () => {

        const props: DocList_t = {
            columns: [{
                name: 'A',
                label: 'LabelA',
                alignRight: false,
                sortable: false,
                sortDirection: SortDirection_t.ASC,
            }],
            data: [
                {
                    A: 'valueA_0'
                },
                {
                    A: 'valueA_1'
                },
            ],
            pager: {
                totalItems: 2,
                pageSize: 5,
                selected: 1,
                pageSelected: (page: number) => { }
            },
            rowMenu: [],
            rowSelected: (rowIndex: number) => {}
        };

        const wrapper = Fixture(DocList(props));
        
        //console.log(wrapper.debug());

        expect(wrapper.find('table')).not.toBeEmpty();
        const table = wrapper.find('table');
        expect(table.find('thead tr th').at(1).text()).toBe(props.columns[0].label);
        expect(table.find('tbody tr').length).toBe(props.data.length);
        expect(table.find('tbody tr').at(0).find('td').at(1).text()).toBe(props.data[0]['A']);
        expect(table.find('tbody tr').at(1).find('td').at(1).text()).toBe(props.data[1]['A']);

        //console.log(table.debug());    

        expect(wrapper.find('Pager')).not.toBeEmpty();
        const pager = wrapper.find('Pager');

        //console.log(pager.debug());

        expect(pager.find('Page').length).toBe(1);
        expect(pager.find('Page').at(0).prop('isActive')).toBe(true);
    });

});

