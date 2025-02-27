import { fetchData } from "./data-fetch.js";
import { normalize } from "./normalize.js";
import { validate } from "./validate.js";

export async function createDynamicRanking(options) {
    // get container for component
    const container = document.getElementById(options.containerId);
    if (!container) {
        throw new Error('Element ' + options.containerId + ' was not found.');
    }

    // get data for rankings
    var rawData = await fetchData(options.dataSource);
    rawData = rawData.data
    // console.log(rawData);

    validate(rawData, options.criteriaColumns)

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
    renderUI(container, scores, options.criteriaColumns, options.defaultWeights, processedData, options.model);
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
                }
            }

            scores.push([item['PlayerName'], score.toFixed(2)]);
            // console.log(item['name']);
        }
    }

    else {
        for (let i = 0; i < Object.keys(data).length; i++) {
            const item = data[i];
            var score = 1;
            var w = 0;

            for (let j = 0; j < Object.keys(item).length; j++) {
                const criteriaName = Object.keys(item)[j];
                const criteriaValue = item[criteriaName];


                if (columns.includes(criteriaName) && typeof criteriaValue === 'number') {
                    const weight = weights[w];
                    w++;
                    score *= criteriaValue * weight;
                }
            }

            scores.push([item['PlayerName'], score]);
        }
    }

    return scores;
}

function renderUI(container, scores, criteriaColumns, defaultWeights, data, model) {

    const orderedScores = scores.sort((a, b) => b[1] - a[1]);
    
    // Clear any existing content
    container.innerHTML = '';
    const rankingsWindow = document.createElement('div');
    rankingsWindow.classList.add('rankings-window');

    // Render each score inside the embedded window with the 'ranking-element' class
    for (let i = 0; i < orderedScores.length; i++) {
        const rankingElement = document.createElement('div');
        rankingElement.classList.add('ranking-element');
        rankingElement.textContent = `${i + 1}: ${orderedScores[i][0]} - ${orderedScores[i][1]}`;
        rankingsWindow.appendChild(rankingElement);
    };

    container.appendChild(rankingsWindow);

    const slidersWindow = document.createElement('div');
    slidersWindow.classList.add('sliders-window');

    const title = document.createElement('h2');
    title.textContent = "Critera";
    container.appendChild(title);

    for (let i = 0; i < criteriaColumns.length; i++) {
        const sliderElement = document.createElement('div');
        sliderElement.classList.add('slider');
        sliderElement.innerHTML = `
        <label for="slider${i}}">${criteriaColumns[i]}</label>
        <input type="range" id="slider${i}" min="0" max="5" value="${defaultWeights[i]}"></input>
        <span id="sliderValue${i}">${defaultWeights[i]}</span>`;

        const slider = sliderElement.querySelector(`#slider${i}`);
        const sliderValue = sliderElement.querySelector(`#sliderValue${i}`);

        // Update the value dynamically when the slider is moved
        slider.addEventListener('change', function () {
            const value = slider.value;
            sliderValue.textContent = value; // Update the value text next to the slider
            defaultWeights[i] = value; // Update the array or variable you want to adjust
            const scores = calculateScores(data, criteriaColumns, model, defaultWeights)
            renderUI(container, scores, criteriaColumns, defaultWeights, data, model)
        });

        container.appendChild(sliderElement)
    }
}