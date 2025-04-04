import { fetchData } from "../lib/data-fetch.js";
import { clean } from "../lib/clean.js";
import { DynamicRanking } from "../lib/dynamic-ranking.js";

export async function createDynamicRanking() {
    try {
        // craft API URL
        const baseURL = document.getElementById('source-select').value;
        const season = '&season=' + document.getElementById('season-select').value;
        const group = "&group=" + document.getElementById('group-select').value;
        const teamID = document.getElementById('team-select').value;
        var team;
        if (teamID == 'all') {
            team = '';
        }
        else {
            team = '&teamId=' + teamID;
        }

        // get data for rankings
        const dataSource = baseURL + group + season + team
                        + '&playerPool=ALL&limit=999';
        
        var rawData = await fetchData(dataSource);

        // manipulate/parse data from file as necessary
        rawData = rawData['stats'][0]['splits'];

        // console.log(rawData)

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
        // const containerId = 'ranking';
        const slidersContainerId = 'sliders-container';
        const rankingsContainerId = 'rankings-container';
        const model = 'weighted-sum';
        const primaryKey = {
            id: "PlayerName",
            path: "player:fullName"
        }
        const digits = 2;
        const sort = "descending";

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