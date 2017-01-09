
import { mount, shallow } from 'enzyme';
import * as ReactDOM from 'react-dom';
import { createElement as __, DOM as _, Component, PropTypes, ReactElement } from 'react';
import * as TestUtils from 'react-addons-test-utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

/**
 *  Simulate an event 'click', 'touchTap', ... on a react element.
 * 
 *      enzyme simulate function doesn't support touchTap event.
 *      cfr https://github.com/airbnb/enzyme/issues/99 
 * 
 */
export function simulateEvent(wrappedTarget : any, eventType : string) {
    if (wrappedTarget.node) {
        // wrappedTarget was obtained using enzyme's mount()
        const domNode = ReactDOM.findDOMNode(wrappedTarget.node)
        TestUtils.Simulate[eventType](domNode)
    } else {
        // wrappedTarget was obtained using enzyme's shallow()
        wrappedTarget.simulate(eventType)
    }
}


/**
 *  Applies the muiTheme (mandatory field in react context) for material ui components.
 *      cfr https://github.com/callemall/material-ui/issues/866
 * 
 */
export class TestWrapper extends Component<any, any> {
    static childContextTypes = {
        muiTheme: PropTypes.object
    }
    getChildContext() {
        return { muiTheme: getMuiTheme() };
    }
    render() {
        return _.div({}, this.props.children);
    }
}

export function Fixture (component : ReactElement<any>,context: any= {}) {
    return mount(__(TestWrapper, context, component));
}