function fetchTeams() {
    const teamSelect = document.getElementById('team-select');
  
    fetch('https://statsapi.mlb.com/api/v1/teams?sportId=1')
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

try {
    fetchTeams();
}

catch (error) {
    console.error(error);
}

