document.addEventListener("DOMContentLoaded", () => {
  const teamsGrid = document.getElementById("teams-grid");

  fetch("data/drivers.json")
    .then((response) => response.json())
    .then((data) => {
      data.teams.forEach((team) => {
        const teamCard = document.createElement("div");
        teamCard.className = "team-card";

        const teamLogo = document.createElement("img");
        teamLogo.src = team.logo;
        teamLogo.alt = `${team.name} Logo`;
        teamLogo.className = "team-logo";

        const teamName = document.createElement("h3");
        teamName.textContent = team.name;

        const driversList = document.createElement("ul");
        driversList.className = "drivers-list";
        team.drivers.forEach((driver) => {
          const driverItem = document.createElement("li");
          driverItem.textContent = driver;
          driversList.appendChild(driverItem);
        });

        teamCard.appendChild(teamLogo);
        teamCard.appendChild(teamName);
        teamCard.appendChild(driversList);

        teamsGrid.appendChild(teamCard);
      });
    })
    .catch((error) => console.error("Error fetching team data:", error));
});