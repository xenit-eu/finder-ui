import generateAutoCollapseParameters, { GenerateAutoCollapseParametersOutput_t } from "./generateAutoCollapseParameters";

function sortByPriority(params: readonly GenerateAutoCollapseParametersOutput_t[]): readonly GenerateAutoCollapseParametersOutput_t[] {
    return params.slice().sort((a, b) => b.priority - a.priority);
}

describe("breadcrumbs/generateAutoCollapseParameters", () => {
    it("generates one set of parameters when maxItems is set", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            maxItems: 4,
        });

        expect(sortByPriority(data)).toMatchSnapshot();
    });

    it("generates parameters when no constraints are set", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
        });

        expect(data).toContainEqual({
            priority: 11,
            output: {
                maxItems: 10,
                itemsBeforeCollapse: 1,
                itemsAfterCollapse: 1,
            },
        });
        expect(sortByPriority(data)).toMatchSnapshot();
    });

    it("generates parameters when having itemsBeforeCollapse fixed", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            itemsBeforeCollapse: 1,
        });

        expect(data.map((d) => d.output.itemsBeforeCollapse)).not.toContain(2);

        expect(sortByPriority(data.slice(1)).map((d) => d.output.itemsAfterCollapse)).toEqual([7, 6, 5, 4, 3, 2, 1]);

        expect(sortByPriority(data)).toMatchSnapshot();
    });

    it("generates parameters when having itemsAfterCollapse fixed", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            itemsAfterCollapse: 2,
        });

        expect(data.slice(1).map((d) => d.output.itemsAfterCollapse)).not.toContain(1);
        expect(data.map((d) => d.output.itemsAfterCollapse)).not.toContain(3);

        expect(sortByPriority(data.slice(1)).map((d) => d.output.itemsBeforeCollapse)).toEqual([6, 5, 4, 3, 2, 1]);

        expect(sortByPriority(data)).toMatchSnapshot();

    });

    it("generates parameters when having itemsBeforeCollapse set to a range", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            itemsBeforeCollapse: {
                min: 1,
                max: 2,
            },
        });

        expect(data.slice(1).map((d) => d.output.itemsBeforeCollapse)).not.toContain(3);
        expect(sortByPriority(data)).toMatchSnapshot();
    });

    it("generates parameters when having itemsAfterCollapse set to a range", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            itemsAfterCollapse: {
                min: 2,
                max: 4,
            },
        });

        expect(data.slice(1).map((d) => d.output.itemsAfterCollapse)).not.toContain(1);
        expect(data.slice(1).map((d) => d.output.itemsAfterCollapse)).not.toContain(5);
        expect(sortByPriority(data)).toMatchSnapshot();
    });

    it("generates parameters when having both itemsBeforeCollapse and itemsAfterCollapse set to a range", () => {
        const data = generateAutoCollapseParameters({
            size: 10,
            itemsBeforeCollapse: {
                min: 1,
                max: 2,
            },
            itemsAfterCollapse: {
                min: 1,
                max: 2,
            },
        });
        expect(data.slice(1).map((d) => d.output.itemsBeforeCollapse)).toContain(2);
        expect(data.slice(1).map((d) => d.output.itemsAfterCollapse)).toContain(2);
        expect(data.slice(1).map((d) => d.output.itemsBeforeCollapse)).not.toContain(3);
        expect(data.slice(1).map((d) => d.output.itemsAfterCollapse)).not.toContain(3);
        expect(sortByPriority(data)).toMatchSnapshot();
    });
});
