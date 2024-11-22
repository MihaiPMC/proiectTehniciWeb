document.addEventListener("DOMContentLoaded", () => {
  const standingsTable = document.querySelector("#standings-table tbody");
  const canvas = document.getElementById("team-chart");
  const ctx = canvas.getContext("2d");
  let chartData = null;

  function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const aspectRatio = 1.5;
    
    canvas.width = Math.min(containerWidth - 40, 800);
    canvas.height = canvas.width / aspectRatio;
    
    if (chartData) {
      drawBarChart(ctx, chartData);
    }
  }

  window.addEventListener('resize', resizeCanvas);

  fetch("data/stats.json")
    .then((response) => response.json())
    .then((data) => {
      data.drivers.sort((a, b) => b.points - a.points);

      data.drivers.forEach((driver, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${driver.name}</td>
          <td>${driver.team}</td>
          <td>${driver.points}</td>
        `;
        standingsTable.appendChild(row);
      });

      const teamPoints = {};
      data.drivers.forEach((driver) => {
        teamPoints[driver.team] = (teamPoints[driver.team] || 0) + driver.points;
      });
      
      chartData = teamPoints;
      resizeCanvas();
    })
    .catch((error) => console.error("Error fetching stats data:", error));
});

function drawBarChart(ctx, teamPoints) {
  const sortedTeams = Object.entries(teamPoints)
    .sort(([,a], [,b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const teams = Object.keys(sortedTeams);
  const points = Object.values(sortedTeams);
  const maxPoints = Math.max(...points);

  const padding = {
    top: 40,
    right: 40,
    bottom: 120, 
    left: 40
  };
  const chartWidth = ctx.canvas.width - (padding.left + padding.right);
  const chartHeight = ctx.canvas.height - (padding.top + padding.bottom);
  const barWidth = (chartWidth / teams.length) * 0.8;
  const spacing = (chartWidth / teams.length) * 0.2;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const teamColors = {
    'Mercedes': '#28F3D2',
    'Red Bull Racing': '#3571C6',
    'Ferrari': '#E80020',
    'McLaren': '#FF8001',
    'Alpine': '#0093CC',
    'AlphaTauri': '#6592FE',
    'Aston Martin': '#229971',
    'Williams': '#63C4FF',
    'Alfa Romeo': '#000000',
    'Haas F1 Team': '#B6BABD'
  };

  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, chartHeight + padding.top);
  ctx.lineTo(chartWidth + padding.left, chartHeight + padding.top);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.stroke();

  for(let i = 0; i <= 5; i++) {
    const y = chartHeight + padding.top - (i * chartHeight/5);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(chartWidth + padding.left, y);
    ctx.strokeStyle = '#f0f0f0';
    ctx.stroke();
  }

  teams.forEach((team, i) => {
    const x = padding.left + (i * (barWidth + spacing));
    const barHeight = (points[i] / maxPoints) * chartHeight;
    const y = chartHeight + padding.top - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    const teamColor = teamColors[team] || '#999';
    gradient.addColorStop(0, teamColor);
    gradient.addColorStop(1, adjustColor(teamColor, -20));
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(x, y + barHeight);
    ctx.lineTo(x, y + 5);
    ctx.quadraticCurveTo(x, y, x + 5, y);
    ctx.lineTo(x + barWidth - 5, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + 5);
    ctx.lineTo(x + barWidth, y + barHeight);
    ctx.fill();

    ctx.save();
    ctx.translate(x + barWidth/2, chartHeight + padding.top + 30);
    ctx.rotate(-Math.PI / 4); 
    ctx.textAlign = 'right';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial'; 
    ctx.fillText(team, 0, 0);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(points[i], x + barWidth/2, y - 10);
  });

  ctx.font = '12px Arial';
  for(let i = 0; i <= 5; i++) {
    const y = chartHeight + padding.top - (i * chartHeight/5);
    const points = Math.round((i * maxPoints/5));
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(points, padding.left - 10, y + 4);
  }
}

function adjustColor(color, amount) {
  return color.replace(/[\da-f]{2}/gi, h => {
    const num = parseInt(h, 16);
    const val = Math.max(0, Math.min(255, num + amount));
    return val.toString(16).padStart(2, '0');
  });
}