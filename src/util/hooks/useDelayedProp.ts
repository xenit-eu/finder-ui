import { useDebugValue, useEffect, useState } from "react";
export default function useDelayedProp<T>(prop: T, delayMs: number, immediate?: (prop: T) => boolean): T {
    const [propValue, setPropValue] = useState(prop);
    useEffect(() => {
        if (immediate && immediate(prop)) {
            setPropValue(prop);
        }
        const timeout = setTimeout(() => setPropValue(prop), delayMs);
        return () => clearTimeout(timeout);
    }, [prop]);

    return propValue;
}
