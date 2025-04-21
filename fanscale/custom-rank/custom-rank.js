import { fetchData } from "/lib/data-fetch.js";
import { clean } from "/lib/clean.js";
import { DynamicRanking } from "/lib/dynamic-ranking.js";

export async function createDynamicRanking(rawData) {
    try {
        // get data for rankings
        
        
        
        // var rawData = await fetchData(dataSource);

        // manipulate/parse data from file as necessary
        

        // specify features and their properties
        features = {

        };

        // specify container, model, primary key, score decimal places, and ranking sort method
        const slidersContainerId = 'sliders-container';
        const rankingsContainerId = 'rankings-container';
        const model = 'weighted-sum';
        const primaryKey = {
            id: "Model",
            path: "Model"
        }
        const digits = 2;
        const sort = "descending";

        // clean data
        const cleanData = clean(rawData, groupFeatures, primaryKey);

        console.log("cleaned data: ", cleanData)

        // construct ranking system
        new DynamicRanking(
            slidersContainerId,
            rankingsContainerId,
            cleanData,
            model,
            groupFeatures,
            primaryKey,
            digits,
            sort
        );
    }

    catch (error) {
        console.error(error);
    }
}