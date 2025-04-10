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
        const features = {
            'pitching': [
                { id: "gamesPlayed", name: "Games Played", path: "stat:gamesPlayed", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "gamesStarted", name: "Games Started", path: "stat:gamesStarted", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "runs", name: "Runs", path: "stat:runs", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "homeRuns", name: "Home Runs", path: "stat:homeRuns", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "strikeOuts", name: "Strikeouts", path: "stat:strikeOuts", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "baseOnBalls", name: "Walks (BB)", path: "stat:baseOnBalls", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "hits", name: "Hits", path: "stat:hits", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "era", name: "ERA", path: "stat:era", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "inningsPitched", name: "Innings Pitched", path: "stat:inningsPitched", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "wins", name: "Wins", path: "stat:wins", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "losses", name: "Losses", path: "stat:losses", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "saves", name: "Saves", path: "stat:saves", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "earnedRuns", name: "Earned Runs", path: "stat:earnedRuns", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "whip", name: "WHIP", path: "stat:whip", normalization: 'log', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "battersFaced", name: "Batters Faced", path: "stat:battersFaced", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "outs", name: "Outs", path: "stat:outs", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "gamesPitched", name: "Games Pitched", path: "stat:gamesPitched", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "completeGames", name: "Complete Games", path: "stat:completeGames", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "shutouts", name: "Shutouts", path: "stat:shutouts", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "wildPitches", name: "Wild Pitches", path: "stat:wildPitches", normalization: 'standard', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "winPercentage", name: "Win Percentage", path: "stat:winPercentage", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "gamesFinished", name: "Games Finished", path: "stat:gamesFinished", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "strikeoutWalkRatio", name: "K/BB Ratio", path: "stat:strikeoutWalkRatio", normalization: 'linear', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "strikeoutsPer9Inn", name: "K/9", path: "stat:strikeoutsPer9Inn", normalization: 'linear', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "walksPer9Inn", name: "BB/9", path: "stat:walksPer9Inn", normalization: 'linear', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "hitsPer9Inn", name: "H/9", path: "stat:hitsPer9Inn", normalization: 'linear', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "runsScoredPer9", name: "R/9", path: "stat:runsScoredPer9", normalization: 'linear', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "homeRunsPer9", name: "HR/9", path: "stat:homeRunsPer9", normalization: 'linear', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 }
            ],
            'hitting': [
                { id: "gamesPlayed", name: "Games Played", path: "stat:gamesPlayed", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "runs", name: "Runs", path: "stat:runs", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "doubles", name: "Doubles", path: "stat:doubles", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "triples", name: "Triples", path: "stat:triples", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "homeRuns", name: "Home Runs", path: "stat:homeRuns", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "baseOnBalls", name: "Walks (BB)", path: "stat:baseOnBalls", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "hits", name: "Hits", path: "stat:hits", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "hitByPitch", name: "Hit By Pitch", path: "stat:hitByPitch", normalization: 'standard', strategy: 'maximize', defaultWeight: 3, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "avg", name: "AVG", path: "stat:avg", normalization: 'linear', strategy: 'maximize', defaultWeight: 6, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "atBats", name: "At Bats", path: "stat:atBats", normalization: 'standard', strategy: 'maximize', defaultWeight: 3, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "obp", name: "OBP", path: "stat:obp", normalization: 'linear', strategy: 'maximize', defaultWeight: 6, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "slg", name: "SLG", path: "stat:slg", normalization: 'linear', strategy: 'maximize', defaultWeight: 6, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "ops", name: "OPS", path: "stat:ops", normalization: 'linear', strategy: 'maximize', defaultWeight: 7, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "stolenBases", name: "Stolen Bases", path: "stat:stolenBases", normalization: 'standard', strategy: 'maximize', defaultWeight: 4, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "plateAppearances", name: "Plate Appearances", path: "stat:plateAppearances", normalization: 'standard', strategy: 'maximize', defaultWeight: 3, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "totalBases", name: "Total Bases", path: "stat:totalBases", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "rbi", name: "RBI", path: "stat:rbi", normalization: 'standard', strategy: 'maximize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "sacBunts", name: "Sacrifice Bunts", path: "stat:sacBunts", normalization: 'standard', strategy: 'maximize', defaultWeight: 2, userWeight: null, minWeight: 0, maxWeight: 10 },
                { id: "atBatsPerHomeRun", name: "AB/HR", path: "stat:atBatsPerHomeRun", normalization: 'linear', strategy: 'minimize', defaultWeight: 5, userWeight: null, minWeight: 0, maxWeight: 10 }
            ]       
        };

        const groupFeatures = features[document.getElementById('group-select').value];

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