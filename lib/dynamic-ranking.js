import { normalize } from "./normalize.js";
import { validate } from "./validate.js";

// export async function createDynamicRanking(containerId, data, model, features, primaryKey, digits) {
export class DynamicRanking
{
    constructor(containerId, data, model, features, primaryKey, digits)
    {
        // member variables
        this.containerId = containerId;
        this.model = model;
        this.features = features;
        this.primaryKey = primaryKey;
        this.digits = digits;

        // add currentWeight key-value pair to each feature
        this.features.forEach(feature => {
            feature.currentWeight = feature.defaultWeight;
        });
        
        // get container for component
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error('Element ' + this.containerId + ' was not found.');
        }

        // normalize the data
        this.data = normalize(data, this.features);
        
        // validate data
        validate(this.data, this.features);

        // calculate scores
        this.scores = calculateScores(
            this.data,
            this.features,
            this.model,
            this.primaryKey,
        );

        // render UI for the component
        renderUI(this.container, this.scores, this.features, this.data, this.model, this.digits, this.primaryKey);
    }
}

function renderUI(container, scores, features, data, model, digits, primaryKey) {    
    // clear any existing content
    container.innerHTML = '';

    // create rankings window
    const rankingsWindow = document.createElement('div');
    rankingsWindow.classList.add('rankings-window');

    // create sliders window
    const slidersWindow = document.createElement('div');
    slidersWindow.classList.add('sliders-window');

    // render each score inside the embedded window with the 'ranking-element' class
    let position = 1;
    scores.forEach(score => {
        const rankingElement = document.createElement('div');
        rankingElement.classList.add('ranking-element');
        rankingElement.textContent = `${position}: ${score.key} - ${(score.score).toFixed(digits)}`;
        position += 1;
        rankingsWindow.appendChild(rankingElement);
    });

    container.appendChild(rankingsWindow);

    
    // render each slider inside the sliders window with 'slider'element' class
    const title = document.createElement('h2');
    title.textContent = "Critera";
    slidersWindow.appendChild(title);

    features.forEach(feature => {
        const sliderElement = document.createElement('div');
        sliderElement.classList.add('slider');
        sliderElement.innerHTML = `
        <label for="slider${feature.id}}">${feature.name}</label>
        <input type="range" id="slider${feature.id}" min="${feature.minWeight}" max="${feature.maxWeight}" value="${feature.defaultWeight}"></input>
        <span id="sliderValue${feature.id}">${feature.defaultWeight}</span>`;

        const slider = sliderElement.querySelector(`#slider${feature.id}`);
        const sliderValue = sliderElement.querySelector(`#sliderValue${feature.id}`);

        // Update the value dynamically when the slider is moved
        slider.addEventListener('change', function () {
            const value = slider.value;
            sliderValue.textContent = value; // Update the value text next to the slider
            feature.defaultWeight = value; // Update the array or variable you want to adjust
            const scores = calculateScores(data, features, model, primaryKey);
            renderUI(container, scores, features, data, model, digits, primaryKey)
        });

        container.appendChild(sliderElement)
    });
}

function calculateScores(data, features, model, primaryKey) {
    const scores = [];

    if (model == 'weighted-sum') {
        data.forEach(item => {
            let score = 0;

            features.forEach(feature => {
                if (feature.userWeight == null) {
                    score += item[feature.id] * feature.defaultWeight;
                }
                else {
                    score += item[feature.id] * feature.userWeight;
                }
            })
            const key = item[primaryKey.id];
            scores.push({ key, score });
        })
    }

    else if (model == 'weighted-product') {
        data.forEach(item => {
            let score = 0;

            features.forEach(feature => {
                if (feature.userWeight == null) {
                    score *= item[feature.id] * feature.defaultWeight;
                }
                else {
                    score *= item[feature.id] * feature.userWeight;
                }
            })
            const key = item[primaryKey.id];
            scores.push({ key, score });
        })
    }

    return scores.sort((a, b) => b.score - a.score);
}