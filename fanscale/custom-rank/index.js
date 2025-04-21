import { createDynamicRanking } from "./custom-rank.js";

var parsedData;
var strategies;

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
        parsedData = parseCSV(csvText);

        // populate private key selection box
        const keys = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
        populatePrimaryKeys(keys);

        // populate strategy box
        populateStrategyBox(keys);
        
        strategies = getStrategiesFromCheckboxes();
        createDynamicRanking(parsedData, strategies);
    };
    reader.readAsText(file);
});

// setup listeners
document.getElementById('primary-key').addEventListener('change', function(event) {
    populateStrategyBox(parsedData.length > 0 ? Object.keys(parsedData[0]) : [])
    strategies = getStrategiesFromCheckboxes();
    createDynamicRanking(parsedData, strategies);
});

document.getElementById('model').addEventListener('change', function(event) {
    strategies = getStrategiesFromCheckboxes();
    createDynamicRanking(parsedData, strategies);
});

document.getElementById('sort').addEventListener('change', function(event) {
    strategies = getStrategiesFromCheckboxes();
    createDynamicRanking(parsedData, strategies);
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

    // simulate user change
    if (keys.length > 0) {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change'));
    }
}

function populateStrategyBox(keys)
{
    const container = document.getElementById('strategies');
    container.innerHTML = '<label for="strategies">Maximize Criteria:</label>';

    keys.filter(key => key !== document.getElementById('primary-key').value)
        .forEach(feature => {
        const label = document.createElement('label');
        label.style.display = 'block'; // makes each checkbox on a new line

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = feature;
        checkbox.name = 'feature-checkbox';
        checkbox.checked = true;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${feature}`));
            
        checkbox.addEventListener('change', function (event) {
            strategies = getStrategiesFromCheckboxes();
            createDynamicRanking(parsedData, strategies);
        });

        container.appendChild(label);
    });
}

function getStrategiesFromCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="feature-checkbox"]');
    return Array.from(checkboxes).map(cb => cb.checked ? 'maximize' : 'minimize');
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
