import { normalize } from "./normalize.js";

export function createDynamicRanking(options) {
    // get container for component
    const container = document.getElementById(options.containerId);
    if (!container) {
        throw new Error('Element ' + options.containerId + ' was not found.');
    }

    // get data for rankings
    const rawDataPromise = fetchJSONDataPromise(options.dataSource);

    // normalize the data
    const processedData = normalize(rawDataPromise, options.normalization);

    // calculate scores
    const scores = calculateScores(
        rawDataPromise, // change to processedData
        options.criteriaColumns,
        options.model,
        options.normalization,
        options.defaultWeights
    );

    // render UI for the component
    renderUI(container, scores);
}

function calculateScores(dataPromise, columns, model, normalization, weights) {
    const scores = [];

    dataPromise.then((data) => {
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
                    
                    console.log(criteriaName, ": ", criteriaValue, " * ", weight, " = ", criteriaValue * weight);
                }
            }

            scores.push(score);
            console.log(item['name'], score);
        }
    })

    return scores;
}

function renderUI(container, scores) {

}

async function fetchJSONDataPromise(dataSource) {
    try {
        const res = await fetch(dataSource);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Unable to fetch data:", error);
        throw error;
    }
}