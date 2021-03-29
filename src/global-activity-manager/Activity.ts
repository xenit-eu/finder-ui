import React from "react";
import { IActivity } from "./ActivityManager";
import ActivityManagerContext from "./ActivityManagerContext";

export interface IActivityProps {
    readonly active: boolean;
    readonly waitForDeactivate?: boolean;
    readonly children: (active: boolean, onDeactivate: () => void) => React.ReactNode;
}

interface IActivityState {
    paused: boolean;
    alive: boolean;
    deactivating: boolean;
}

export default class Activity extends React.Component<IActivityProps, IActivityState> {
    public static contextType = ActivityManagerContext;
    private activity: IActivity | null = null;

    public constructor(props: IActivityProps) {
        super(props);
        this.state = {
            paused: false,
            alive: false,
            deactivating: false,
        };
    }

    private getActivity(): IActivity {
        if (!this.activity) {
            this.activity = this.context.createActivity({
                onStarted: () => new Promise((resolve) => this.setState({ alive: true, deactivating: false }, resolve)),
                onPaused: () => new Promise((resolve) => this.setState({ paused: true, deactivating: false  }, resolve)),
                onResumed: () => new Promise((resolve) => this.setState({ paused: false, deactivating: false  }, resolve)),
                onFinished: () => {
                    this.activity = null;
                    return new Promise((resolve) => this.setState({ alive: false, deactivating: false  }, resolve));
                },
            });
        }
        return this.activity!;
    }

    public componentDidMount() {
        if (this.props.active) {
            this.getActivity().start();
        }
    }

    public componentWillUnmount() {
        this.getActivity().finish();
    }

    public componentDidUpdate(prevProps: IActivityProps) {
        if (this.props.active === prevProps.active) {
            return;
        }
        if (this.props.active) {
            this.getActivity().start();
        } else {
            if (!this.props.waitForDeactivate) {
                this.getActivity().finish();
            } else {
                this.setState({ deactivating: true });
            }
        }
    }

    public render() {
        return this.props.children(this.state.alive && !this.state.paused && !this.state.deactivating, () => {
            if (this.state.deactivating) {
                this.getActivity().finish();
            }
        });
    }

}
