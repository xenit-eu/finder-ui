import React, { DOMAttributes, EventHandler, SyntheticEvent } from "react";

type StopPropagation_Props_t = {
    children: React.ReactElement<EventDOMAttributes>,

};
type EventHandlerPropertyNames<T> = { [K in keyof T]: T[K] extends EventHandler<any> ? K : never }[keyof T];

type AllDOMAttributes = Required<DOMAttributes<HTMLElement>>;
type EventDOMAttributes = {
    [k in EventHandlerPropertyNames<AllDOMAttributes>]: AllDOMAttributes[k]
};
type EventNames = keyof EventDOMAttributes;

const eventNames: ReadonlyArray<EventNames> = [
    // Mouse events
    "onClick", "onContextMenu", "onDoubleClick", "onDrag", "onDragEnd", "onDragEnter", "onDragExit",
    "onDragLeave", "onDragOver", "onDragStart", "onDrop", "onMouseDown", "onMouseEnter", "onMouseLeave",
    "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp",
    // Keyboard events
    "onKeyDown", "onKeyPress", "onKeyUp",
];

const defaultHandler: EventHandler<SyntheticEvent> = (ev) => ev.stopPropagation();

const defaultHandlers: Partial<EventDOMAttributes> = {};
for (const eventHandlerName of eventNames) {
    defaultHandlers[eventHandlerName] = defaultHandler;
}

function containsCustomHandler(obj: object) {
    for (const objKey of Object.keys(obj)) {
        if (eventNames.indexOf(objKey as any) !== -1) {
            return true;
        }
    }
    return false;
}

function createCustomHandlers(obj: object) {
    const customHandlers: Partial<EventDOMAttributes> = {};
    for (const objKey of Object.keys(obj)) {
        if (obj[objKey] instanceof Function && eventNames.indexOf(objKey as any) !== -1) {
            customHandlers[objKey as any] = (ev: SyntheticEvent) => {
                obj[objKey](ev);
                defaultHandler(ev);
            };
        }
    }
    return customHandlers;
}

/**
 * Stops event propagation to the parents.
 *
 * This is useful when, for example, embedding clickable elements inside other clickable elements,
 * without having to call stopPropagation() on every click event you can imagine.
 *
 * This component only accepts one child element, and requires it to have *ALL* HTML event handlers,
 * so you will have to use either a HTML element as a child, or a component that passes all other props to the HTML element.
 */
export default function StopPropagation(props: StopPropagation_Props_t) {
    const child = React.Children.only(props.children);

    if (!containsCustomHandler(child.props)) {
        return React.cloneElement(child, defaultHandlers);
    } else {
        const handlers = {
            ...defaultHandlers,
            ...createCustomHandlers(child.props),
        };
        return React.cloneElement(child, handlers);
    }

}
