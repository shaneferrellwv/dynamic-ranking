export function clean(dirtyData, features, primaryKey) {
    // ensure that data is a list
    if (!Array.isArray(dirtyData)) {
        throw new Error("Data should be an array of items.");
    }

    var cleanData = [];

    dirtyData.forEach((item, index) => {
        const cleanItem = {};

        // get primary key identifier
        let keyItem = item;
        let keyPath = primaryKey.path.split(':');
        keyPath.forEach(part => {
            if (!(part in keyItem)) {
                throw new Error(`Item at index ${index} is missing object part: ${part}`);
            }
            else {
                if (part != keyPath[keyPath.length - 1]) {
                    keyItem = keyItem[part];
                }
                else {
                    cleanItem[primaryKey.id] = keyItem[part];
                }
            }
        })

        // get specified features
        features.forEach(feature => {
            let featureItem = item;
            let path = feature.path.split(':');
            path.forEach(part => {
                if (!(part in featureItem)) {
                    throw new Error(`Item at index ${index} is missing object part: ${part}`);
                }
                else {
                    if (part != path[path.length - 1]) {
                        featureItem = featureItem[part];
                    }
                    else { // item value
                        cleanItem[feature.id] = parseFloat(featureItem[part]);
                    }
                }
            })
        })

        cleanData.push(cleanItem);
    })

  
    return cleanData;
}