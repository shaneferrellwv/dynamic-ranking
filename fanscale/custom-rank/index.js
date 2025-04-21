import { createDynamicRanking } from "./custom-rank";

document.getElementById('csvInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        console.log('Invalid file type');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);
        console.log(parsedData);

        // populate private key selection box
        const keys = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
        populatePrimaryKeys(keys);
    };
    reader.readAsText(file);
});

document.getElementById('primary-key').addEventListener('change', function(event) {
    createDynamicRanking();
});

function populatePrimaryKeys(keys) {
    const select = document.getElementById('primary-key');
    select.innerHTML = ''; // Clear existing options

    keys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
    });
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i] ?? null;
        });
        return obj;
    });
}
