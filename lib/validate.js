export function validate(data, features) {
    if (!Array.isArray(data)) {
        throw new Error("Data should be an array of items.");
    }

    // Filter out invalid items instead of throwing errors
    return data.filter(item => {
        // Check if all required features exist and are valid numbers
        return features.every(feature => {
            // Check if feature exists in item
            if (!(feature.id in item)) {
                console.warn(`Excluding item missing feature: ${feature.id}`, item);
                return false;
            }
            
            // Check if feature value is a valid number
            if (typeof item[feature.id] !== 'number' || isNaN(item[feature.id])) {
                console.warn(`Excluding item with invalid ${feature.id}: "${item[feature.id]}"`, item);
                return false;
            }
            
            return true;
        });
    });
}