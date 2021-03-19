import { ActivityManager, IActivityCallbacks } from "./ActivityManager";

class EmptyActivityCallbacks implements IActivityCallbacks {
  public onStarted(): void {}
  public onPaused(): void {}
  public onResumed(): void {}
  public onFinished(): void {}
}

describe("ActivityManager", () => {
  it("Allows registering activities and starting them", async () => {
    const manager = new ActivityManager();
    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const startedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const finishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const pausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const resumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    expect(startedSpy).toHaveBeenCalledTimes(1);
    expect(finishedSpy).not.toHaveBeenCalled();
    expect(pausedSpy).not.toHaveBeenCalled();
    expect(resumedSpy).not.toHaveBeenCalled();

    const secondActivity = manager.createActivity(new EmptyActivityCallbacks());

    await secondActivity.start();

    expect(startedSpy).toHaveBeenCalledTimes(1);
    expect(finishedSpy).not.toHaveBeenCalled();
    expect(pausedSpy).toHaveBeenCalled();
    expect(resumedSpy).not.toHaveBeenCalled();

    await secondActivity.finish();

    expect(startedSpy).toHaveBeenCalledTimes(1);
    expect(finishedSpy).not.toHaveBeenCalled();
    expect(pausedSpy).toHaveBeenCalled();
    expect(resumedSpy).toHaveBeenCalled();

    await firstActivity.finish();

    expect(startedSpy).toHaveBeenCalledTimes(1);
    expect(finishedSpy).toHaveBeenCalled();
    expect(pausedSpy).toHaveBeenCalled();
    expect(resumedSpy).toHaveBeenCalled();
  });

  it("Only resumes the previously activity when the current activity is stopped", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    const thirdActivity = manager.createActivity(new EmptyActivityCallbacks());

    await thirdActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await thirdActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(1);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Does not allow to start an activity that has finished", async () => {
    const manager = new ActivityManager();

    const activity = manager.createActivity(new EmptyActivityCallbacks());

    await activity.start();

    await activity.finish();

    expect(activity.start()).rejects.toMatchInlineSnapshot(
      `[Error: A finished activity can not be started]`,
    );
  });

  it("Ignores finishing of non-started activities", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    const thirdActivity = manager.createActivity(new EmptyActivityCallbacks());

    await thirdActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Restarts a paused activity when requested", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(1);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Finishes a paused activity when requested", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Does not pause an activity that has not started", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(0);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Does not start an activity that is running", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
  });

  it("Does not finish an activity that is finished", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);

    await firstActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
  });

  it("Does not pause a finished activity", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();

    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");

    const firstActivity = manager.createActivity(firstActivityCallbacks);

    await firstActivity.start();
    await firstActivity.finish();

    const secondActivityCallbacks = new EmptyActivityCallbacks();

    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");

    const secondActivity = manager.createActivity(secondActivityCallbacks);

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await secondActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(0);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(1);
  });

  it("Finishing the most recently started activity does not attempt to resume the first activity", async () => {
    const manager = new ActivityManager();

    const firstActivityCallbacks = new EmptyActivityCallbacks();
    const firstStartedSpy = spyOn(firstActivityCallbacks, "onStarted");
    const firstFinishedSpy = spyOn(firstActivityCallbacks, "onFinished");
    const firstPausedSpy = spyOn(firstActivityCallbacks, "onPaused");
    const firstResumedSpy = spyOn(firstActivityCallbacks, "onResumed");
    const firstActivity = manager.createActivity(firstActivityCallbacks); // 4ed

    await firstActivity.start();

    const secondActivityCallbacks = new EmptyActivityCallbacks();
    const secondStartedSpy = spyOn(secondActivityCallbacks, "onStarted");
    const secondFinishedSpy = spyOn(secondActivityCallbacks, "onFinished");
    const secondPausedSpy = spyOn(secondActivityCallbacks, "onPaused");
    const secondResumedSpy = spyOn(secondActivityCallbacks, "onResumed");
    const secondActivity = manager.createActivity(secondActivityCallbacks); // c4e

    await secondActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(0);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(0);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.start();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(1);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(0);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(0);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await firstActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(1);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(1);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(0);

    await secondActivity.finish();

    expect(firstStartedSpy).toHaveBeenCalledTimes(1);
    expect(firstPausedSpy).toHaveBeenCalledTimes(1);
    expect(firstResumedSpy).toHaveBeenCalledTimes(1);
    expect(firstFinishedSpy).toHaveBeenCalledTimes(1);
    expect(secondStartedSpy).toHaveBeenCalledTimes(1);
    expect(secondPausedSpy).toHaveBeenCalledTimes(1);
    expect(secondResumedSpy).toHaveBeenCalledTimes(1);
    expect(secondFinishedSpy).toHaveBeenCalledTimes(1);
  });
});
