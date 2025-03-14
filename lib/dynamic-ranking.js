import { normalize } from "./normalize.js";
import { validate } from "./validate.js";
import { models } from './models.js';
import { sorts } from './sort.js';

export class DynamicRanking
{
    constructor(containerId, data, model, features, primaryKey, digits, sort)
    {
        // member variables
        this.containerId = containerId;
        this.model = models[model];
        this.features = features;
        this.primaryKey = primaryKey;
        this.digits = digits;
        this.sort = sorts[sort];

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
        this.scores = this.calculateScores(
            this.data,
            this.features,
            this.model,
            this.primaryKey,
        );

        // render UI for the component
        this.render();
    }

    calculateScores() {
        const scores = this.data.map(item => ({
            key: item[this.primaryKey.id],
            score: this.model(item, this.features)
        }));

        return this.sort(scores);
    }

    render() {
        this.renderRankingsWindow();
        this.renderSlidersWindow();
    }

    renderRankingsWindow() {
        // clear any existing content
        this.container.innerHTML = '';

        // create rankings window
        this.rankingsWindow = document.createElement('div');
        this.rankingsWindow.classList.add('rankings-window');

        // render each score inside the embedded window with the 'ranking-element' class
        let position = 1;
        this.scores.forEach(score => {
            const rankingElement = document.createElement('div');
            rankingElement.classList.add('ranking-element');
            rankingElement.textContent = `${position}: ${score.key} - ${(score.score).toFixed(this.digits)}`;
            position += 1;
            this.rankingsWindow.appendChild(rankingElement);
        });

        this.container.appendChild(this.rankingsWindow);
    }

    renderSlidersWindow() {
        // create sliders window
        this.slidersWindow = document.createElement('div');
        this.slidersWindow.classList.add('sliders-window');

        // render each slider inside the sliders window with 'slider'element' class
        const title = document.createElement('h2');
        title.textContent = "Critera";
        this.slidersWindow.appendChild(title);

        this.features.forEach(feature => {
            const sliderElement = document.createElement('div');
            sliderElement.classList.add('slider');
            sliderElement.innerHTML = `
            <label for="slider${feature.id}}">${feature.name}</label>
            <input type="range" id="slider${feature.id}" min="${feature.minWeight}" max="${feature.maxWeight}" value="${feature.currentWeight}"></input>
            <span id="sliderValue${feature.id}">${feature.currentWeight}</span>`;

            const slider = sliderElement.querySelector(`#slider${feature.id}`);
            const sliderValue = sliderElement.querySelector(`#sliderValue${feature.id}`);

            // Update the value dynamically when the slider is moved
            slider.addEventListener('change', () => {
                const value = slider.value;
                sliderValue.textContent = value; // Update the value text next to the slider
                feature.currentWeight = value; // Update the array or variable you want to adjust
                this.scores = this.calculateScores(this.data, this.features, this.model, this.primaryKey);
                this.render();
            });

            this.container.appendChild(sliderElement)
        });
    }
}