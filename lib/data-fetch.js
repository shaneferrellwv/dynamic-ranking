export async function fetchDataPromise(sourceType, dataSource) {
    if (sourceType === "JSON") {
        const response = await fetch(dataSource);
        const json = await response.json();
        if (Object.keys(json).length === 0)
            throw new Error(dataSource + " is empty.");
        return json;
    }
}