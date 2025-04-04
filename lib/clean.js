export function clean(dirtyData, features, primaryKey) {
    if (!Array.isArray(dirtyData)) {
        throw new Error("Data should be an array of items.");
    }

    const cleanData = [];

    dirtyData.forEach((item, index) => {
        const cleanItem = {};

        // extract primary key
        let keyItem = item;
        let keyPath = primaryKey.path.split(':');
        for (let part of keyPath) {
            if (!(part in keyItem)) {
                return; // skip this item if key path is broken
            }
            keyItem = keyItem[part];
        }
        cleanItem[primaryKey.id] = keyItem;

        // extract features
        let valid = true;

        for (let feature of features) {
            let featureItem = item;
            let path = feature.path.split(':');

            for (let i = 0; i < path.length; i++) {
                const part = path[i];

                if (!(part in featureItem)) {
                    valid = false;
                    break;
                }

                featureItem = featureItem[part];
            }

            if (!valid) break;

            const parsed = parseFloat(featureItem);
            if (isNaN(parsed)) {
                valid = false;
                break;
            }

            cleanItem[feature.id] = parsed;
        }

        if (valid) {
            cleanData.push(cleanItem);
        }
    });

    return cleanData;
}
