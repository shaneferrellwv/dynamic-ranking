export const sorts = {
    descending: (scores) => scores.sort((a, b) => b.score - a.score),
    ascending: (scores) => scores.sort((a, b) => a.score - b.score),
    byKey: (scores) => scores.sort((a, b) => a.key.localeCompare(b.key)),
};
