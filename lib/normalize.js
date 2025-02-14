export function normalize(rawData, technique, columns) {
    // Make a shallow copy so we don't modify original data
    const normalizedData = rawData.map(item => ({ ...item }));

    columns.forEach(col => {
        // Extract the column's values from the raw data
        const values = rawData.map(item => item[col]);

        // check if all data that contains this column
        if (values.includes(undefined) || !values)
            throw new Error("Column " + col + " is not a property on all data.");

        switch (technique) {
            case "linear": {
                const min = Math.min(...values);
                const max = Math.max(...values);
                if (max === min) {
                    normalizedData.forEach(item => item[col] = 0);
                } else {
                    normalizedData.forEach(item => {
                        item[col] = (item[col] - min) / (max - min);
                    });
                }
                break;
            }
            case "log": {
                const minVal = Math.min(...values);
                const shift = minVal <= 0 ? 1 - minVal : 0;
                normalizedData.forEach(item => {
                    item[col] = Math.log(item[col] + shift);
                });
                break;
            }
            case "standard": {
                const mean = values.reduce((sum, x) => sum + x, 0) / values.length;
                const std = Math.sqrt(values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length);
                if (std === 0) {
                    normalizedData.forEach(item => item[col] = 0);
                } else {
                    normalizedData.forEach(item => {
                        item[col] = (item[col] - mean) / std;
                    });
                }
                break;
            }
            default:
                throw new Error("Unknown normalization technique: " + technique);
        }
    });

    return normalizedData;
}
