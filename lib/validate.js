export function validate(rawData, criteriaColumns) {
    console.log(rawData.data[0]['PlayerName'])
    criteriaColumns.forEach(col => { 
            const values = rawData.map(item => item[col]);
            //console.log(col)
            //console.log(rawData.length)
            if (values.includes(undefined) || !values)
                throw new Error("Column " + col + " is not a property on all data.");
        }
    )
    return true;
}