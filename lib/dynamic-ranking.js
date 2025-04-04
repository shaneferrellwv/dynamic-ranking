import { normalize } from "./normalize.js";
import { validate } from "./validate.js";
import { models } from './models.js';
import { sorts } from './sort.js';

export class DynamicRanking
{
    constructor(slidersContainerId, rankingsContainerId, data, model, features, primaryKey, digits, sort)
    {
        // member variables
        this.slidersContainerId = slidersContainerId;
        this.rankingsContainerId = rankingsContainerId;
        this.model = models[model];
        this.features = features;
        this.primaryKey = primaryKey;
        this.digits = digits;
        this.sort = sorts[sort];

        // add currentWeight key-value pair to each feature
        this.features.forEach(feature => {
            feature.currentWeight = feature.defaultWeight;
        });
        
        // get container for sliders
        this.slidersContainer = document.getElementById(this.slidersContainerId);
        if (!this.slidersContainer) {
            throw new Error('Element ' + this.slidersContainerId + ' was not found.');
        }

        // get container for ranking
        this.rankingsContainer = document.getElementById(this.rankingsContainerId);
        if (!this.rankingsContainer) {
            throw new Error('Element ' + this.rankingssContainerId + ' was not found.');
        }

        // normalize the data
        this.data = normalize(data, this.features);
        console.log("raw data: ", data, "normalized data: ", this.data);
        
        // validate data
        validate(this.data, this.features);

        // calculate scores
        this.scores = this.calculateScores(
            this.data,
            this.features,
            this.model,
            this.primaryKey,
        );

        
        

        // create sliders window
        this.slidersWindow = document.createElement('div');
        this.slidersWindow.classList.add('sliders-window');

        // render UI for the component
        this.render();
    }

    calculateScores() {
        const scores = this.data.map(item => ({
            key: item[this.primaryKey.id],
            score: this.model(item, this.features.filter(item => item.active))
        }));

        return this.sort(scores);
    }

    render() {
        this.renderRankingsWindow();
        this.renderSlidersWindow();
    }

    renderRankingsWindow() {
        // clear any existing content by removing rankings window
        this.rankingsContainer.innerHTML = '';

        // create rankings window
        const rankingsWindow = document.createElement('div');
        rankingsWindow.classList.add('rankings-window');

        // render each score inside the embedded window with the 'ranking-element' class
        let position = 1;
        this.scores.forEach(score => {
            const rankingElement = document.createElement('div');
            rankingElement.classList.add('ranking-element');
            rankingElement.textContent = `${position}: ${score.key} - ${(score.score).toFixed(this.digits)}`;
            position += 1;
            rankingsWindow.appendChild(rankingElement);
        });

        this.rankingsContainer.appendChild(rankingsWindow);
    }

    renderSlidersWindow() {
        // clear any existing content by removing sliders window
        this.slidersContainer.innerHTML = '';

        // render active sliders
        const sliders = document.createElement('div');
        this.features.forEach((feature, index) => {
            if (!feature.active)
                return;
            
            // create element wrapper
            const sliderElement = document.createElement('div');
            sliderElement.className = 'slider-element';

            const label = document.createElement('label');
            label.textContent = feature.name;
            label.className = 'slider-label';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = feature.minWeight;
            slider.max = feature.maxWeight;
            slider.step = 0.5;
            slider.value = feature.currentWeight ?? feature.defaultWeight;
            slider.className = 'slider-input';
            slider.onchange = () => {
                feature.currentWeight = parseFloat(slider.value);
                this.scores = this.calculateScores();
                this.render();
            };

            const value = document.createElement('span');
            value.className = 'slider-value';
            value.innerHTML = feature.currentWeight ?? feature.defaultWeight;

            const removeButton = document.createElement('span');
            removeButton.textContent = 'x';
            removeButton.className = 'remove-button';
            removeButton.onclick = () => {
                feature.active = false;
                this.scores = this.calculateScores();
                this.render();
            }

            sliderElement.appendChild(label);
            sliderElement.appendChild(slider);
            sliderElement.appendChild(value);
            sliderElement.appendChild(removeButton);
            sliders.appendChild(sliderElement);
        });
        this.slidersContainer.appendChild(sliders);

        // create new slider selection wrapper
        const newSliderWrapper = document.createElement('div');
        newSliderWrapper.className = 'new-slider-wrapper';

        // render criteria selector dropdown
        const dropdown = document.createElement('select');
        dropdown.className = 'feature-dropdown';

        // add inactive features to dropdown
        const inactiveFeatures = this.features.filter(f => !f.active);
        inactiveFeatures.forEach((feature, i) => {
            const option = document.createElement('option');
            option.value = feature.name;
            option.textContent = feature.name;
            dropdown.appendChild(option);
        });

        // render add-slider button
        const addSliderButton = document.createElement('button');
        addSliderButton.textContent = 'Add Slider';
        addSliderButton.className = 'add-slider-btn';
        addSliderButton.onclick = () => {
            const selected = dropdown.value;
            const feature = this.features.find(f => f.name === selected);
            if (feature) {
            feature.active = true;
            feature.currentWeight = feature.defaultWeight;
            this.scores = this.calculateScores();
            this.render();
            }
        };

        newSliderWrapper.appendChild(dropdown);
        newSliderWrapper.appendChild(addSliderButton);
        this.slidersContainer.appendChild(newSliderWrapper);
    }
}