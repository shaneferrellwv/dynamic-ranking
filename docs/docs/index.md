# dynamic-ranking

client-side library for building interactive dyanamic weighted ranking systems on the web

## Quick Start (index.js)
    // import dynamic-ranking library functions
    import { fetchData } from "../lib/data-fetch.js";
    import { clean } from "../lib/clean.js";
    import { DynamicRanking } from "../lib/dynamic-ranking.js";

    // get data for rankings
    var rawData = await fetchData(dataSource);

    // manipulate/parse data from file as necessary
    rawData = rawData['stats'][0]['splits'];

    // specify features and their properties
    const features = [
        { id: "era", name: "ERA", path: "stat:era", normalization: 'standard', strategy: 'minimize', "defaultWeight": 0, minWeight: 0, maxWeight: 10 },
        { id: "whip", name: "WHIP", path: "stat:whip", normalization: 'log', strategy: 'minimize', "defaultWeight": 0, minWeight: 0, maxWeight: 10 },
        { id: "strikeoutsPer9Inn", name: "K/9", path: "stat:strikeoutsPer9Inn", normalization: 'linear', strategy: 'maximize', "defaultWeight": 0, minWeight: 0, maxWeight: 10 },
        { id: "walksPer9Inn", name: "BB/9", path: "stat:walksPer9Inn", normalization: 'linear', strategy: 'minimize', "defaultWeight": 0, minWeight: 0, maxWeight: 10 },    
    ];

    // specify container, model, primary key, score decimal places, and ranking sort method
    const slidersContainerId = 'sliders-container';
    const rankingsContainerId = 'rankings-container';
    const model = 'weighted-sum';
    const digits = 2;
    const sort = "descending";
    const primaryKey = {
        id: "PlayerName",
        path: "player:fullName"
    }

    // clean data
    const cleanData = clean(rawData, groupFeatures, primaryKey);

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
