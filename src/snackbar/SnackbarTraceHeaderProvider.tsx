import * as React from "react";

const SnackbarTraceHeaderContext = React.createContext({});

SnackbarTraceHeaderContext.displayName = "SnackbarTraceHeaderContext";

export default SnackbarTraceHeaderContext.Provider;
export const SnackbarTraceHeaderConsumer = SnackbarTraceHeaderContext.Consumer;
