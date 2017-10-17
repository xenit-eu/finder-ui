
export const values = (obj: any) => Object.keys(obj).map(k => obj[k]);

export function traverseAndReplace (o: any, func: (k: string, v: any) => any) {
    Object.getOwnPropertyNames(o).forEach((i: string) => {
        const result = func.apply(this, [i, o[i]]);
        if (result) {
            o[i] = result;
        } else {
            if (o[i] !== null && typeof(o[i]) === "object") {
                //going one step down in the object tree!!
                traverseAndReplace(o[i], func);
            }
        }
    });
}
