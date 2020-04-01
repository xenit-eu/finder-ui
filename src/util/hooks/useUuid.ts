import { useState } from "react";
import { v4 } from "uuid";

export default function useUuid(prefix: string = ""): string {
    return useState(() => prefix + v4())[0];
}
