import { createDynamicRanking } from "./lib/dynamic-ranking";

try
{
    createDynamicRanking({
        containerId: 'ranking'
    });

}
catch (error) {
    console.error(error);
}