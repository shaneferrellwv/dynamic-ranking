export async function fetchData(source) {
    // fetch file from source
    const response = await fetch(source);
    if (!response.ok) {
        throw new Error(`Erorr fetching file '${source}' from server. HTTP error status: ${response.status}`);
    }

    var data;

    // detect file type by extension
    // JSON file
    if (source.endsWith('.json')) {
        data = await response.json();
    }
    // CSV file
    else if (source.endsWith('.csv')) {
        const text = await response.text();
        data = parseCSV(text);
    }
    // external API URL
    else {
        // try JSON first
        try {
            data = await response.json();
        }
        // try CSV next
        catch (e) {
            const text = await response.text();
            data = parseCSV(text);
        }
    }

    // make sure that the file actually has data
    if (Object.keys(data).length === 0)
        throw new Error(source + " is empty.");

    return data;
    // }
}

// via Copilot, has not been tested
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(val => val.trim());
        const item = {};
        headers.forEach((header, index) => {
        const num = parseFloat(values[index]);
        item[header] = isNaN(num) ? values[index] : num;
        });
        return item;
    });
}