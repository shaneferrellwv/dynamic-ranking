export function validate(rawData, criteriaColumns) {
    criteriaColumns.forEach(col => { 
            const values = rawData.map(item => item[col]);
            if (values.includes(undefined) || !values)
                throw new Error("Column " + col + " is not a property on all data.");
        }
    )
    return true;
}