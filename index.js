import { createDynamicRanking } from "./lib/dynamic-ranking";

try {
    createDynamicRanking({
        containerId: 'ranking',
        dataSourceType: 'JSON',
        dataSource: './data.json',
        model: 'WSM',
        normalization: 'linear',
        criteriaColumns: ["criteria0", "criteria1", "criteria2"],
        defaultWeights: [2, 3, 4]
    });

}
catch (error) {
    console.error(error);
}