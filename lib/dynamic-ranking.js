import { fetchDataPromise } from "./data-fetch.js";
import { normalize } from "./normalize.js";

export async function createDynamicRanking(options) {
    // get container for component
    const container = document.getElementById(options.containerId);
    if (!container) {
        throw new Error('Element ' + options.containerId + ' was not found.');
    }

    // get data for rankings
    const rawData = await fetchDataPromise(options.dataSourceType, options.dataSource);

    // console.log(rawData);

    // normalize the data
    const processedData = normalize(rawData, options.normalization, options.criteriaColumns);

    // calculate scores
    const scores = calculateScores(
        processedData,
        options.criteriaColumns,
        options.model,
        options.normalization,
        options.defaultWeights
    );

    // render UI for the component
    renderUI(container, scores);
}

function calculateScores(data, columns, model, normalization, weights) {
    const scores = [];

    for (let i = 0; i < Object.keys(data).length; i++) {
        const item = data[i];
        var score = 0;
        var w = 0;

        for (let j = 0; j < Object.keys(item).length; j++) {
            const criteriaName = Object.keys(item)[j];
            const criteriaValue = item[criteriaName];


            if (columns.includes(j) && typeof criteriaValue === 'number') {
                const weight = weights[w];
                w++;
                score += criteriaValue * weight;
                
                // console.log(criteriaName, ": ", criteriaValue, " * ", weight, " = ", criteriaValue * weight);
            }
        }

        scores.push(score);
        // console.log(item['name'], score);
    }

    return scores;
}

function renderUI(container, scores) {

}