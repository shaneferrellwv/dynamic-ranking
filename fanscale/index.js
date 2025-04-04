import { createDynamicRanking } from "./fanscale";

function fetchTeams() {
    const teamSelect = document.getElementById('team-select');
    teamSelect.innerHTML = '';
  
    const seasonParam = document.getElementById('season-select').value;
  
    fetch('https://statsapi.mlb.com/api/v1/teams?sportId=1&season=' + seasonParam)
      .then(res => res.json())
      .then(data => {
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Teams';
        teamSelect.appendChild(allOption);
  
        data.teams.forEach(team => {
          const option = document.createElement('option');
          option.value = team.id;
          option.textContent = team.name;
          teamSelect.appendChild(option);
        });
      });
}

function fetchSeasons() {
  const seasonSelect = document.getElementById('season-select');

  for (let year = 2025; year >= 1876; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    seasonSelect.appendChild(option);
  }
}

function addSeasonSelectionListener() {
  document.getElementById('season-select').addEventListener('change', function () {
    fetchTeams();
    createDynamicRanking();
  });
}

function addTeamSelectionListener() {
  document.getElementById('team-select').addEventListener('change', function () {
    createDynamicRanking();
  });
}

function addGroupSelectionListener() {
  document.getElementById('group-select').addEventListener('change', function () {
    createDynamicRanking();
  });
}

try {
  addSeasonSelectionListener();
  addTeamSelectionListener();
  addGroupSelectionListener();
  fetchSeasons();
  fetchTeams();
}

catch (error) {
    console.error(error);
}