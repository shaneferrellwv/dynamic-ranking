export function normalize(cleanData, features) {
    // Make a shallow copy so we don't modify original data
    const normalizedData = cleanData.map(item => ({ ...item }));

    features.forEach(feature => {
        // Extract the feature's values from the raw data
        const values = cleanData.map(item => item[feature.id]);

        switch (feature.normalization) {
            case "linear": {
                const min = Math.min(...values);
                const max = Math.max(...values);
                if (max === min) {
                    normalizedData.forEach(item => item[feature.id] = 0);
                } else {
                    if (feature.strategy == "maximize") {
                        normalizedData.forEach(item => {
                            item[feature.id] = (item[feature.id] - min) / (max - min);
                        });
                    }
                    else if (feature.strategy == "minimize") {
                        normalizedData.forEach(item => {
                            item[feature.id] = (max - item[feature.id]) / (max - min);
                        });
                    }
                }
                break;
            }
            case "log": {
                const minVal = Math.min(...values);
                const shift = minVal <= 0 ? 1 - minVal : 0;
                if (feature.strategy == "maximize") {
                    normalizedData.forEach(item => {
                        item[feature.id] = Math.log(item[feature.id] + shift);
                    });
                }
                else if (feature.strategy == "minimize") {
                    normalizedData.forEach(item => {
                        item[feature.id] = item[feature.id] + shift;
                    });
                    const max = Math.max(...normalizedData.map(item => item[feature.id]));
                    normalizedData.forEach(item => {
                        item[feature.id] = Math.log(max - item[feature.id] + 1);
                    });
                }
                break;
            }
            case "standard": {
                const mean = values.reduce((sum, x) => sum + x, 0) / values.length;
                const std = Math.sqrt(values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length);
                if (std === 0) {
                    normalizedData.forEach(item => item[feature.id] = 0);
                } else {
                    if (feature.strategy == "maximize") {
                        normalizedData.forEach(item => {
                            item[feature.id] = (item[feature.id] - mean) / std;
                        });
                    }
                    else if (feature.strategy == "minimize") {
                        normalizedData.forEach(item => {
                            item[feature.id] = -(item[feature.id] - mean) / std;
                        });
                    }
                }
                break;
            }
            default:
                throw new Error("Unknown normalization technique: " + technique);
        }
    });

    return normalizedData;
}