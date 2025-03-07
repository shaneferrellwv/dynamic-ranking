import { fetchData } from "../lib/data-fetch.js";
import { clean } from "../lib/clean.js";
import { createDynamicRanking } from "../lib/dynamic-ranking";

try {
    // get data for rankings
    const dataSource = 'https://www.fangraphs.com/api/leaders/major-league/data?age=&pos=all&stats=pit&lg=all&qual=y&season=2024&season1=1871&startdate=&enddate=&month=0&hand=&team=0&pageitems=2000000000&pagenum=1&ind=0&rost=0&players=&type=0&postseason=&sortdir=default&sortstat=SOhttps://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2024&teamId=136&playerPool=ALL';
    var rawData = await fetchData(dataSource);

    // manipulate/parse data from file as necessary
    // rawData = rawData['stats'][0]['splits'];
    rawData = rawData.data;

    // specify features and their properties
    const features = [
        {
            id: "ERA",
            name: "ERA",
            path: "ERA",
            normalization: 'linear',
            defaultWeight: 0,
            userWeight: null,
            minWeight: -5,
            maxWeight: 5
        },
        {
            id: "WHIP",
            name: "WHIP",
            path: "WHIP",
            normalization: 'log',
            defaultWeight: 1,
            userWeight: null,
            minWeight: 0,
            maxWeight: 5
        },
        {
            id: "BB9",      // id field cannot contain non-alaphabetic/non-numeric characters
            name: "BB/9",
            path: "BB/9",
            normalization: 'log',
            defaultWeight: 5,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
    ];

    // specify container, model, primary key, and score decimal places
    const containerId = 'ranking';
    const model = 'weighted-sum';
    const primaryKey = {
        id: "PlayerName",
        path: "PlayerName"
    }
    const digits = 2;

    // clean data
    const cleanData = clean(rawData, features, primaryKey);


    // construct ranking system
    createDynamicRanking(
        containerId,
        cleanData,
        model,
        features,
        primaryKey,
        digits
    );

}

catch (error) {
    console.error(error);
}