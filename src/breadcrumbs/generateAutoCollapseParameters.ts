import invariant from "tiny-invariant";

export type GenerateAutoCollapseParameters_t = {
    itemsBeforeCollapse?: number | { min?: number, max?: number },
    itemsAfterCollapse?: number | { min?: number, max?: number },
    maxItems?: number,
    size: number,
};

type AutoCollapseOutput_t = {
    maxItems: number,
    itemsBeforeCollapse: number,
    itemsAfterCollapse: number,
};

export type GenerateAutoCollapseParametersOutput_t = {
    priority: number,
    output: AutoCollapseOutput_t,
};
function sumIfDefined(a: number | undefined, b: number | undefined): number | undefined {
    if (a !== undefined && b !== undefined) {
        return a + b;
    }
    return undefined;
}

function getMin(n: number | { min?: number } | undefined): number | undefined {
    if (typeof n !== "object") {
        return n;
    }
    return n.min;
}

function getMax(n: number | { max?: number } | undefined): number | undefined {
    if (typeof n !== "object") {
        return n;
    }
    return n.max;
}

function* autoCollapseParametersGen(parameters: GenerateAutoCollapseParameters_t): Generator<GenerateAutoCollapseParametersOutput_t> {
    const minItemsBeforeCollapse = getMin(parameters.itemsBeforeCollapse) || 1;
    const minItemsAfterCollapse = getMin(parameters.itemsAfterCollapse) || 1;
    // If max items is set, only one option is available, that with the configured options
    if (parameters.maxItems !== undefined) {
        yield {
            priority: 1,
            output: {
                maxItems: parameters.maxItems,
                itemsBeforeCollapse: minItemsBeforeCollapse,
                itemsAfterCollapse: minItemsAfterCollapse,
            },
        };
        return;
    }
    // Showing the breadcrumbs full size is preferred
    yield {
        priority: parameters.size + 1,
        output: {
            maxItems: Math.max(parameters.size, minItemsAfterCollapse + minItemsAfterCollapse + 1),
            itemsBeforeCollapse: minItemsBeforeCollapse,
            itemsAfterCollapse: minItemsAfterCollapse,
        },
    };

    const maxItemsBeforeCollapse = getMax(parameters.itemsBeforeCollapse);
    const maxItemsAfterCollapse = getMax(parameters.itemsAfterCollapse);

    // Calculate minimum and maximum number of items that are shown
    const minItemsShown = minItemsBeforeCollapse + minItemsAfterCollapse;
    const maxItemsShown = sumIfDefined(maxItemsBeforeCollapse, maxItemsAfterCollapse) || parameters.size - 1;

    let itemsBeforeCollapse = getMin(parameters.itemsBeforeCollapse) || 1;
    let itemsAfterCollapse = getMin(parameters.itemsAfterCollapse) || 1;

    // Step through the options, incrementing the collapse item that is furthest away from its maximum value with every step
    for (let i = minItemsShown; i <= maxItemsShown; i++) {
        if (itemsBeforeCollapse + itemsAfterCollapse >= parameters.size - 1) {
            break;
        }
        yield {
            priority: i,
            output: {
                maxItems: parameters.size - 1,
                itemsBeforeCollapse,
                itemsAfterCollapse,
            },
        };
        const beforeCollapsePref = calculatePreference(minItemsBeforeCollapse, maxItemsBeforeCollapse || parameters.size, itemsBeforeCollapse);
        const afterCollapsePref = calculatePreference(minItemsAfterCollapse, maxItemsAfterCollapse || parameters.size, itemsAfterCollapse);
        if (beforeCollapsePref < afterCollapsePref) {
            itemsAfterCollapse++;
        } else {
            itemsBeforeCollapse++;
        }
    }

}

/**
 * Calculates where between minValue & maxValue the currentValue lays, as a fraction
 */
function calculatePreference(minValue: number, maxValue: number, currentValue: number): number {
    if (currentValue >= maxValue) {
        return -1;
    }
    invariant(minValue <= maxValue);
    invariant(minValue <= currentValue);
    invariant(currentValue <= maxValue);
    // Normalize to minValue = 0
    maxValue = maxValue - minValue;
    currentValue = currentValue - minValue;

    return 1 - currentValue / maxValue;
}

function toArray<T>(generator: Generator<T>): readonly T[] {
    const data: T[] = [];
    let value = generator.next();

    while (!value.done) {
        data.push(value.value);
        value = generator.next();
    }

    return data;
}

export default function generateAutoCollapseParameters(parameters: GenerateAutoCollapseParameters_t): readonly GenerateAutoCollapseParametersOutput_t[] {
    return toArray(autoCollapseParametersGen(parameters));
}
