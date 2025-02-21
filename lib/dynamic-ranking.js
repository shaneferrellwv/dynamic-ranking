import { fetchDataPromise } from "./data-fetch.js";
import { normalize } from "./normalize.js";
import { validate } from "./validate.js";

export async function createDynamicRanking(options) {
    // get container for component
    const container = document.getElementById(options.containerId);
    if (!container) {
        throw new Error('Element ' + options.containerId + ' was not found.');
    }

    // get data for rankings
    const rawData = await fetchDataPromise(options.dataSourceType, options.dataSource);

    //console.log(rawData);

    const check = validate(rawData, options.criteriaColumns)

    // normalize the data
    const processedData = normalize(rawData, options.normalization, options.criteriaColumns);

    // calculate scores
    const scores = calculateScores(
        processedData,
        options.criteriaColumns,
        options.model,
        options.defaultWeights
    );

    // render UI for the component
    renderUI(container, scores);
}

function calculateScores(data, columns, model, weights) {
    const scores = [];

    if (model == 'WSM') {
        for (let i = 0; i < Object.keys(data).length; i++) {
            const item = data[i];
            var score = 0;
            var w = 0;

            for (let j = 0; j < Object.keys(item).length; j++) {
                const criteriaName = Object.keys(item)[j];
                const criteriaValue = item[criteriaName];


                if (columns.includes(criteriaName) && typeof criteriaValue === 'number') {
                    const weight = weights[w];
                    w++;
                    score += criteriaValue * weight;
                    
                    // console.log(criteriaName, ": ", criteriaValue, " * ", weight, " = ", criteriaValue * weight);
                }
            }

            scores.push([item['name'], score]);
            // console.log(item['name']);
        }
    }

    else {
        // Other Model
    }

    return scores;
}

function renderUI(container, scores) {

    const orderedScores = scores.sort((a, b) => b[1] - a[1]);
    
    // Clear any existing content
    container.innerHTML = `<h2>Ordered Ranked Results</h2>`;

    // Render the ranking and scores
    orderedScores.forEach((item, index) => {
        const rankingElement = document.createElement('div');
        
        // Add both the item data and score
        rankingElement.innerHTML = ` 
            ${item[0]}:  ${item[1]} 
        `;
        
        container.appendChild(rankingElement);
    });
}