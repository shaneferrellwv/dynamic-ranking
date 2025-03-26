import { fetchData } from "../lib/data-fetch.js";
import { clean } from "../lib/clean.js";
import { DynamicRanking } from "../lib/dynamic-ranking.js";

try {
    // craft API URL
    const baseURL = 

    // get data for rankings
    const dataSource = 'https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2024&playerPool=ALL&limit=853';
    var rawData = await fetchData(dataSource);

    // manipulate/parse data from file as necessary
    rawData = rawData['stats'][0]['splits'];
    // rawData = rawData.data;

    console.log(rawData)

    // specify features and their properties
    const features = [
        {
            id: "ERA",
            name: "ERA",
            path: "stat:era",
            normalization: 'standard',
            strategy: 'minimize',
            defaultWeight: 5,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "WHIP",
            name: "WHIP",
            path: "stat:whip",
            normalization: 'log',
            strategy: 'minimize',
            defaultWeight: 5,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "K9",
            name: "K/9",
            path: "stat:strikeoutsPer9Inn",
            strategy: 'maximize',
            normalization: 'linear',
            defaultWeight: 5,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "BB9",
            name: "BB/9",
            path: "stat:walksPer9Inn",
            strategy: 'minimize',
            normalization: 'linear',
            defaultWeight: 5,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        }
    ];

    // specify container, model, primary key, score decimal places, and ranking sort method
    const containerId = 'ranking';
    const model = 'weighted-sum';
    const primaryKey = {
        id: "PlayerName",
        path: "player:fullName"
    }
    const digits = 2;
    const sort = "descending";

    // clean data
    const cleanData = clean(rawData, features, primaryKey);

    // construct ranking system
    new DynamicRanking(
        containerId,
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