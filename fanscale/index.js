import { fetchData } from "../lib/data-fetch.js";
import { clean } from "../lib/clean.js";
import { DynamicRanking } from "../lib/dynamic-ranking.js";

try {
    // get data for rankings
    const dataSource = 'https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2024&playerPool=ALL&limit=853';
    var rawData = await fetchData(dataSource);


    // manipulate/parse data from file as necessary
    rawData = rawData['stats'][0]['splits'];
    // rawData = rawData.data;

    console.log(rawData)

    // specify features and their properties
    const features = [
        // Tier 1: Primary evaluation metrics (default weight: 5)
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
        },
    
        // Tier 2: Important secondary metrics (default weight: 3)
        {
            id: "H9",
            name: "Hits/9",
            path: "stat:hitsPer9Inn",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "HR9",
            name: "HR/9",
            path: "stat:homeRunsPer9",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "OPS",
            name: "OPS Against",
            path: "stat:ops",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "AVG",
            name: "Batting Average Against",
            path: "stat:avg",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "OBP",
            name: "On-Base % Against",
            path: "stat:obp",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "SLG",
            name: "Slugging % Against",
            path: "stat:slg",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 3,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
    
        // Tier 3: Supporting metrics (default weight: 1)
        {
            id: "IP",
            name: "Innings Pitched",
            path: "stat:inningsPitched",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 1,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "StrikePerc",
            name: "Strike %",
            path: "stat:strikePercentage",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 1,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "PitchesPerInning",
            name: "Pitches/Inning",
            path: "stat:pitchesPerInning",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 1,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "RunsPer9",
            name: "Runs/9",
            path: "stat:runsScoredPer9",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 1,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
    
        // Tier 4: Counting stats and misc metrics (default weight: 0)
        {
            id: "Wins",
            name: "Wins",
            path: "stat:wins",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Losses",
            name: "Losses",
            path: "stat:losses",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Saves",
            name: "Saves",
            path: "stat:saves",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "SaveOpps",
            name: "Save Opportunities",
            path: "stat:saveOpportunities",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Holds",
            name: "Holds",
            path: "stat:holds",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "BlownSaves",
            name: "Blown Saves",
            path: "stat:blownSaves",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "CompleteGames",
            name: "Complete Games",
            path: "stat:completeGames",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Shutouts",
            name: "Shutouts",
            path: "stat:shutouts",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "GamesPitched",
            name: "Games Pitched",
            path: "stat:gamesPitched",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "GamesStarted",
            name: "Games Started",
            path: "stat:gamesStarted",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "GamesFinished",
            name: "Games Finished",
            path: "stat:gamesFinished",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Hits",
            name: "Hits Allowed",
            path: "stat:hits",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Runs",
            name: "Runs Allowed",
            path: "stat:runs",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "EarnedRuns",
            name: "Earned Runs",
            path: "stat:earnedRuns",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "HomeRuns",
            name: "Home Runs Allowed",
            path: "stat:homeRuns",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Strikeouts",
            name: "Strikeouts",
            path: "stat:strikeOuts",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Walks",
            name: "Walks",
            path: "stat:baseOnBalls",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "IntentionalWalks",
            name: "Intentional Walks",
            path: "stat:intentionalWalks",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "HitBatsmen",
            name: "Hit Batsmen",
            path: "stat:hitBatsmen",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "WildPitches",
            name: "Wild Pitches",
            path: "stat:wildPitches",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Balks",
            name: "Balks",
            path: "stat:balks",
            normalization: 'linear',
            strategy: 'minimize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "BattersFaced",
            name: "Batters Faced",
            path: "stat:battersFaced",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Pitches",
            name: "Number of Pitches",
            path: "stat:numberOfPitches",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "Strikes",
            name: "Strikes Thrown",
            path: "stat:strikes",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "GroundOuts",
            name: "Ground Outs",
            path: "stat:groundOuts",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "AirOuts",
            name: "Air Outs",
            path: "stat:airOuts",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
            userWeight: null,
            minWeight: 0,
            maxWeight: 10
        },
        {
            id: "GIDP",
            name: "Double Plays Induced",
            path: "stat:groundIntoDoublePlay",
            normalization: 'linear',
            strategy: 'maximize',
            defaultWeight: 0,
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