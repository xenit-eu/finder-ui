import invariant from "tiny-invariant";

export type AutosizeParameters_t = {
    itemsBeforeCollapse?: number | { min?: number, max?: number },
    itemsAfterCollapse?: number | { min?: number, max?: number },
    maxItems?: number,
    size: number,
};

type AutosizeOutput_t = {
    maxItems: number,
    itemsBeforeCollapse: number,
    itemsAfterCollapse: number,
};

export type GenerateParametersOutput_t = {
    priority: number,
    output: AutosizeOutput_t,
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

export default function* generateParameters(parameters: AutosizeParameters_t): Generator<GenerateParametersOutput_t> {
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
            maxItems: parameters.size,
            itemsBeforeCollapse: minItemsBeforeCollapse,
            itemsAfterCollapse: minItemsAfterCollapse,
        },
    };

    const maxItemsBeforeCollapse = getMax(parameters.itemsBeforeCollapse);
    const maxItemsAfterCollapse = getMax(parameters.itemsAfterCollapse);

    // Calculate minimum and maximum number of items that are shown
    const minItemsShown = minItemsBeforeCollapse + minItemsAfterCollapse;
    const maxItemsShown = sumIfDefined(maxItemsBeforeCollapse, maxItemsAfterCollapse) || parameters.size;

    let itemsBeforeCollapse = getMin(parameters.itemsBeforeCollapse) || 1;
    let itemsAfterCollapse = getMin(parameters.itemsAfterCollapse) || 1;

    // Step through the options, incrementing the collapse item that is furthest away from its maximum value with every step
    for (let i = minItemsShown; i <= maxItemsShown; i++) {
        yield {
            priority: i,
            output: {
                maxItems: i,
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
