import debug from "debug";
import { v4 as uuidv4 } from "uuid";

const d = debug("finder-ui:global-activity-manager:ActivityManager");
const callsDebug = d.extend("calls");
const callbacksDebug = d.extend("callbacks");

export interface IActivityCallbacks {
    onStarted(): Promise<void>|void;
    onPaused(): Promise<void>|void;
    onResumed(): Promise<void>|void;
    onFinished(): Promise<void>|void;
}

export interface IActivity {
    start(): Promise<void>;
    finish(): Promise<void>;
    readonly running: boolean;
}

class ActivityInternal implements IActivity {

    public readonly id: string = uuidv4();
    private state: ActivityState = ActivityState.INIT;

    private activityCallbacks: IActivityCallbacks;
    private readonly manager: ActivityManager;

    constructor(activityCallbacks: IActivityCallbacks, manager: ActivityManager) {
        this.activityCallbacks = activityCallbacks;
        this.manager = manager;
    }

    public get running(): boolean {
        return this.state === ActivityState.RUNNING;
    }

    public async start(): Promise<void> {
        callsDebug("Activity[%s].start()", this.id);
        switch (this.state) {
            case ActivityState.INIT:
            case ActivityState.PAUSED:
                await this.manager.beforeStartActivity(this);
            default:
        }
        d("Starting activity %o", this);
        switch (this.state) {
            case ActivityState.INIT:
                callbacksDebug("> Activity[%s].onStarted()", this.id);
                await this.activityCallbacks.onStarted();
                callbacksDebug("< Activity[%s].onStarted()", this.id);
                break;
            case ActivityState.PAUSED:
                callbacksDebug("> Activity[%s].onResumed()", this.id);
                await this.activityCallbacks.onResumed();
                callbacksDebug("< Activity[%s].onResumed()", this.id);
                break;
            case ActivityState.RUNNING:
                // no-op
                break;
            case ActivityState.FINISHED:
                throw new Error("A finished activity can not be started");
            default:
        }
        this.state = ActivityState.RUNNING;
        d("Started activity %o", this);
    }

    public async finish(): Promise<void> {
        callsDebug("Activity[%s].finish()", this.id);
        d("Finishing activity %o", this);
        switch (this.state) {
            case ActivityState.INIT:
                // no-op
                break;
            case ActivityState.PAUSED:
            case ActivityState.RUNNING:
                callbacksDebug("> Activity[%s].onFinished()", this.id);
                await this.activityCallbacks.onFinished();
                callbacksDebug("< Activity[%s].onFinished()", this.id);
                break;
            case ActivityState.FINISHED:
                // no-op
                break;
            default:
        }
        this.state = ActivityState.FINISHED;
        d("Finished activity %o", this);
        await this.manager.afterFinishActivity(this);
    }

    public async pause(): Promise<void> {
        d("Pausing activity %o", this);
        switch (this.state) {
            case ActivityState.INIT:
                // Do not transisition to paused
                return;
            case ActivityState.PAUSED:
                // no-op
                break;
            case ActivityState.RUNNING:
                callbacksDebug("> Activity[%s].onPaused()", this.id);
                await this.activityCallbacks.onPaused();
                callbacksDebug("< Activity[%s].onPaused()", this.id);
                break;
            case ActivityState.FINISHED:
                throw new Error("A finished activity can not be paused");
            default:
        }
        this.state = ActivityState.PAUSED;
        d("Paused activity %o", this);
    }

    public async resume(): Promise<void> {
        d("Resuming activity %o", this);
        switch (this.state) {
            case ActivityState.INIT:
                // Do not transition to running
                return;
            case ActivityState.RUNNING:
                // no-op
                break;
            case ActivityState.PAUSED:
                callbacksDebug("> Activity[%s].onResumed()", this.id);
                await this.activityCallbacks.onResumed();
                callbacksDebug("< Activity[%s].onResumed()", this.id);
                break;
            case ActivityState.FINISHED:
                throw new Error("A finished activity can not be resumed");
            default:
        }
        this.state = ActivityState.RUNNING;
        d("Resumed activity %o", this);
    }

}

enum ActivityState {
    INIT,
    RUNNING,
    PAUSED,
    FINISHED,
}

export default interface IActivityManager {
    createActivity(activityCallbacks: IActivityCallbacks): IActivity;
}

export class ActivityManager implements IActivityManager {
    private readonly runningActivities: ActivityInternal[] = [];

    private globalLock: Promise<void>;

    private async whileLocked(fn: () => Promise<void>): Promise<void> {
        if (!this.globalLock) {
            this.globalLock = new Promise((resolve) => resolve());
        }
        const lock = this.globalLock;
        this.globalLock = (async () => {
            await lock;
            await fn();
        })();
    }

    public createActivity(activityCallbacks: IActivityCallbacks): IActivity {
        const activity = new ActivityInternal(activityCallbacks, this);
        callsDebug("ActivityManager.createActivity() [%s]", activity.id);
        d("Registered activity %o", activity);
        return activity;
    }

    public async beforeStartActivity(activity: ActivityInternal): Promise<void> {
        await this.whileLocked(async () => {
            const existingActivityIndex = this.runningActivities.indexOf(activity);
            if (existingActivityIndex !== -1) {
                d("Activity %o is already in the running activities queue. Moving it to the back", activity);
                this.runningActivities.splice(existingActivityIndex, 1);
            }
            await Promise.all(this.runningActivities.map((act) => act.pause()));
            this.runningActivities.push(activity);
        });
    }

    public async afterFinishActivity(activity: ActivityInternal): Promise<void> {
        await this.whileLocked(async () => {
            const finishedIndex = this.runningActivities.indexOf(activity);
            if (finishedIndex === -1) {
                d("Finished activity %o was not running. Nothing to do.", activity);
                // Activity was not running, so nothing to do
                return;
            }
            this.runningActivities.splice(finishedIndex, 1);
            const lastActivity = this.runningActivities[this.runningActivities.length - 1];
            d("Last activity %o", lastActivity);
            if (lastActivity) {
                await lastActivity.resume();
            }
        });
    }
}
