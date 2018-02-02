export { default as Group } from "./group";
export { default as Centered } from "./centered";
import ncolumn from "./ncolumn";

import "./index.less";

export const OneColumn = ncolumn(1);
export const TwoColumn = ncolumn(2);
export const ThreeColumn = ncolumn(3);
