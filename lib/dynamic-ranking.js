export function createDynamicRanking(options) {
    const container = document.getElementById(options.containerId);
    if (!container) {
        throw new Error('Element ' + options.containerId + ' was not found.');
    }
}