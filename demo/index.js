import { fetchData } from "../lib/data-fetch.js";
import { createDynamicRanking } from "../lib/dynamic-ranking";

try {
    // get data for rankings
    const dataSource = 'https://www.fangraphs.com/api/leaders/major-league/data?age=&pos=all&stats=pit&lg=all&qual=y&season=2024&season1=1871&startdate=&enddate=&month=0&hand=&team=0&pageitems=2000000000&pagenum=1&ind=0&rost=0&players=&type=0&postseason=&sortdir=default&sortstat=SO';
    var rawData = await fetchData(dataSource);

    // manipulate/parse data from file as necessary
    rawData = rawData.data;

    // construct ranking system
    createDynamicRanking(
        rawData,
        {
        containerId: 'ranking',
        model: 'WSM',
        normalization: 'linear',
        featureColumns: ["Age", "K%", "IP"],
        defaultWeights: [2, 3, 4]
    });

}

catch (error) {
    console.error(error);
}