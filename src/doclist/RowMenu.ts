import { IconButton, IconMenu, MenuItem } from "material-ui";
import MoreHorizIcon from "material-ui/svg-icons/navigation/more-horiz";
import { createElement as __, MouseEvent, Component } from "react";
type RowMenu_SharedProps_t<T> = {
    menuItems: Array<MenuItem_t<T>>,
    onMenuItemSelected: (menuKey: T, menuIndex: number) => void,
};
export type MenuItem_t<T> = {
    key: T,
    label: string,
    disabled: boolean,
};
type RowMenu_Props_t<T> = RowMenu_SharedProps_t<T> & {
    onRequestChange: (open: boolean) => void,
    open: boolean,
};
export function RowMenu<T>({ menuItems, onMenuItemSelected, ...props }: RowMenu_Props_t<T>) {
    return __(IconMenu, {
        iconButtonElement: __(IconButton, { style: { padding: "0", height: "initial" }, disableTouchRipple: true }, __(MoreHorizIcon, { color: "grey" })) as any,
        targetOrigin: { horizontal: "right", vertical: "top" },
        anchorOrigin: { horizontal: "right", vertical: "top" },
        onRequestChange: props.onRequestChange,
        open: props.open,
    }, menuItems.map((mi, i) => __(MenuItem, {
        key: i,
        primaryText: mi.label,
        disabled: mi.disabled,
        onClick: (event: MouseEvent<any>) => {
            onMenuItemSelected(mi.key, i);
            event.stopPropagation();
            event.preventDefault();
        },
    })));
}

type LoadMenuItem_Callback_t<T> = (index: number, menuItem: MenuItem_t<T>) => void;

type DynamicRowMenu_Props_t<T> = RowMenu_SharedProps_t<T> & {
    onMenuLoadRequested?: (callback: LoadMenuItem_Callback_t<T>) => Promise<void>,
};

type DynamicRowMenu_State_t<T> = {
    menuItems: Array<MenuItem_t<T>>,
    open: boolean,
};

export default class DynamicRowMenu<T> extends Component<DynamicRowMenu_Props_t<T>, DynamicRowMenu_State_t<T>> {

    constructor(props: DynamicRowMenu_Props_t<T>) {
        super(props);
        this.state = {
            menuItems: [],
            open: false,
        };
    }

    private _triggerMenuLoad(): Promise<void> {
        if (!this.props.onMenuLoadRequested) {
            return Promise.resolve();
        }
        return this.props.onMenuLoadRequested((newMenuIdx, newMenuItem) => {
            this.setState((state) => {
                const newMenuItems = state.menuItems.slice();
                newMenuItems[newMenuIdx] = newMenuItem;
                return {
                    menuItems: newMenuItems,
                };
            });
        });

    }

    public render() {
        return __(RowMenu, {
            open: this.state.open,
            onRequestChange: (open: boolean) => {
                if (open) {
                    Promise.race([
                        this._triggerMenuLoad(),
                        waitFor(100),
                    ]).then(() => this.setState({ open: true }), () => this.setState({ open: true }));
                } else {
                    this.setState({ open: false });
                }
            },
            menuItems: this.props.menuItems
                .map((menuItem, menuIdx) => this.state.menuItems[menuIdx] || menuItem),
            onMenuItemSelected: this.props.onMenuItemSelected,
        });

    }

}

function waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
