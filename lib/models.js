export const models = {
    "weighted-sum": (item, features) => {
        return features.reduce((score, feature) => {
            const weight = feature.userWeight ?? feature.currentWeight;
            return score + item[feature.id] * weight;
        }, 0);
    },

    "weighted-product": (item, features) => {
        return features.reduce((score, feature) => {
            const weight = feature.userWeight ?? feature.currentWeight;
            return score * item[feature.id] * weight;
        }, 1);
    }
};
