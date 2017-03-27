
import { mount, shallow } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { Component, createElement as __, DOM as _, PropTypes, ReactElement } from "react";
import * as TestUtils from "react-addons-test-utils";
import * as ReactDOM from "react-dom";

/**
 *  Simulate an event 'click', 'touchTap', ... on a react element.
 *
 *      enzyme simulate function doesn't support touchTap event.
 *      cfr https://github.com/airbnb/enzyme/issues/99
 *
 */
export function simulateEvent(wrappedTarget: any, eventType: string) {
    if (wrappedTarget.node) {
        // wrappedTarget was obtained using enzyme's mount()
        const domNode = ReactDOM.findDOMNode(wrappedTarget.node);
        TestUtils.Simulate[eventType](domNode);
    } else {
        // wrappedTarget was obtained using enzyme's shallow()
        wrappedTarget.simulate(eventType);
    }
}

/**
 *  Applies the muiTheme (mandatory field in react context) for material ui components.
 *      cfr https://github.com/callemall/material-ui/issues/866
 *
 */
export class TestWrapper extends Component<any, any> {
    public static childContextTypes = {
        muiTheme: PropTypes.object,
    };
    public getChildContext() {
        return { muiTheme: getMuiTheme() };
    }
    public render() {
        return _.div({}, this.props.children);
    }
}

export function Fixture (component: ReactElement<any>, context: any = {}) {
    return mount(__(TestWrapper, context, component));
}
