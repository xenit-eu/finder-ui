
import { mount } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as PropTypes from "prop-types";
import { Children, cloneElement, Component, createElement as __, ReactElement } from "react";
import * as TestUtils from "react-dom/test-utils";

/**
 *  Simulate an event 'click', 'touchTap', ... on a react element.
 *
 *      enzyme simulate function doesn't support touchTap event.
 *      cfr https://github.com/airbnb/enzyme/issues/99
 *
 */
export function simulateEvent(wrappedTarget: any, eventType: string) {
    const node = wrappedTarget.getElement();
    if (node) {
        // wrappedTarget was obtained using enzyme's mount()
        TestUtils.Simulate[eventType](wrappedTarget.getDOMNode());
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
        const { children, ...rest } = this.props;
        const child = Children.only(children);

        return cloneElement(child, rest);
    }
}

export function Fixture(component: ReactElement<any>, props: any = {}) {
    return mount(__(TestWrapper, props, component));
}
