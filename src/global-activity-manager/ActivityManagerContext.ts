import React from "react";
import IActivityManager, { ActivityManager } from "./ActivityManager";

export default React.createContext<IActivityManager>(new ActivityManager());
