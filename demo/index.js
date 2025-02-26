import { createDynamicRanking } from "../lib/dynamic-ranking";

try {
    createDynamicRanking({
        containerId: 'ranking',
        dataSourceType: 'JSON',
        dataSource: 'https://www.fangraphs.com/api/leaders/major-league/data?age=&pos=all&stats=pit&lg=all&qual=y&season=2024&season1=1871&startdate=&enddate=&month=0&hand=&team=0&pageitems=2000000000&pagenum=1&ind=0&rost=0&players=&type=0&postseason=&sortdir=default&sortstat=SO',
        model: 'WSM',
        normalization: 'linear',
        criteriaColumns: ["IP", "K%", "BB%"],
        defaultWeights: [2, 3, 4]
    });

}

catch (error) {
    console.error(error);
}