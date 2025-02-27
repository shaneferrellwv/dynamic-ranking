export async function fetchData(source) {
    // if (source.endsWith('.json')) {
        const response = await fetch(source);
        const json = await response.json();
        if (Object.keys(json).length === 0)
            throw new Error(source + " is empty.");
        return json;
    // }
}