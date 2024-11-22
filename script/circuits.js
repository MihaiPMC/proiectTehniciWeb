document.addEventListener("DOMContentLoaded", () => {
  const circuitsGrid = document.getElementById("circuits-grid");
  const circuitDetails = document.getElementById("circuit-details");

  fetch("data/circuits.json")
    .then((response) => response.json())
    .then((data) => {
      data.circuits.forEach((circuit) => {
        const circuitCard = document.createElement("div");
        circuitCard.className = "circuit-card";

        const circuitName = document.createElement("h3");
        circuitName.textContent = circuit.name;

        const circuitCountry = document.createElement("p");
        circuitCountry.textContent = `Location: ${circuit.country}`;

        const circuitImage = document.createElement("img");
        circuitImage.src = circuit.image;
        circuitImage.alt = `${circuit.name} Image`;
        circuitImage.className = "circuit-image";

        const viewDetailsBtn = document.createElement("button");
        viewDetailsBtn.textContent = "View Details";
        viewDetailsBtn.className = "btn";
        viewDetailsBtn.addEventListener("click", () => {
          circuitDetails.innerHTML = `
            <h3>${circuit.name}</h3>
            <p>
              <span>🌍 Country:</span>
              <span>${circuit.country}</span>
            </p>
            <p>
              <span>📏 Circuit Length:</span>
              <span>${circuit.length}</span>
            </p>
            <p>
              <span>🏁 Race Distance:</span>
              <span>${circuit.laps} laps</span>
            </p>
            <p>
              <span>📅 First Grand Prix:</span>
              <span>${circuit.firstGP}</span>
            </p>
          `;
          circuitDetails.classList.add("active");
          circuitDetails.scrollIntoView({ behavior: "smooth", block: "center" });
        });

        circuitCard.appendChild(circuitImage);

        const infoWrapper = document.createElement("div");
        infoWrapper.className = "circuit-info-wrapper";

        infoWrapper.appendChild(circuitName);
        infoWrapper.appendChild(circuitCountry);
        infoWrapper.appendChild(viewDetailsBtn);

        circuitCard.appendChild(infoWrapper);

        circuitsGrid.appendChild(circuitCard);
      });
    })
    .catch((error) => console.error("Error fetching circuit data:", error));
});
