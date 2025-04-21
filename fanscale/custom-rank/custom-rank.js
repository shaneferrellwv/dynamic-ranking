import { fetchData } from "/lib/data-fetch.js";
import { clean } from "/lib/clean.js";
import { DynamicRanking } from "/lib/dynamic-ranking.js";

export async function createDynamicRanking(rawData, strategies) {
    try {
        // get data for rankings
        console.log(rawData)

        // manipulate/parse data from file as necessary
        

        // dynamically specify features and their properties
        const selectedStrategies = strategies; // this array matches feature order
        console.log("strategies", selectedStrategies);
        const features = rawData.length > 0
            ? Object.keys(rawData[0])
                .filter(key => key !== document.getElementById('primary-key').value)
                .map((key, index) => ({
                    id: key,
                    name: key,
                    path: key,
                    normalization: 'linear',
                    strategy: selectedStrategies[index] || 'minimize', // fallback if needed
                    defaultWeight: 0,
                    minWeight: 0,
                    maxWeight: 5,
                }))
            : [];
        

        // specify container, model, primary key, score decimal places, and ranking sort method
        const slidersContainerId = 'sliders-container';
        const rankingsContainerId = 'rankings-container';
        const model = document.getElementById('model').value;
        const primaryKey = {
            id: document.getElementById('primary-key').value,
            path: document.getElementById('primary-key').value
        }
        const digits = 2;
        const sort = document.getElementById('sort').value;

        // clean data
        const cleanData = clean(rawData, features, primaryKey);

        console.log("cleaned data: ", cleanData)

        // construct ranking system
        new DynamicRanking(
            slidersContainerId,
            rankingsContainerId,
            cleanData,
            model,
            features,
            primaryKey,
            digits,
            sort
        );
    }

    catch (error) {
        console.error(error);
    }
}