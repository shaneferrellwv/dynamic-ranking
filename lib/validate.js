export function validate(data, features) {
    if (!Array.isArray(data)) {
      throw new Error("Data should be an array of items.");
    }

    data.forEach((item, index) => {
        features.forEach(feature => {
            if (!(feature.id in item)) {
                throw new Error(`Item at index ${index} is missing object part: ${part}`);
            }
            else {
                if (!(feature.id in item)) {
                    throw new Error(`Item at index ${index} is missing feature: ${feature.id}`);
                }
                else if (typeof item[feature.id] !== 'number' || isNaN(item[feature.id])) {
                    throw new Error(`Feature ${feature.id} in item at index ${index} is not a valid number.`);
                }
            }
        });
    });
    return true;
  }