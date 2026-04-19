export function initRadarChart(canvasId, currentSkillsStr, requiredSkillsArray, gapArray) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set explicit dimensions
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  
  // Parse inputs
  const allSkillsRaw = new Set([...requiredSkillsArray, ...gapArray.map(g => g.n)]);
  // Add some current skills if they overlap
  const currentSkills = currentSkillsStr.split(',').map(s => s.trim().toLowerCase());
  
  const labels = Array.from(allSkillsRaw).slice(0, 6); // Max 6 points for visual clarity
  const dataRequired = labels.map(() => 80 + Math.random() * 20); // Required baseline
  const dataCurrent = labels.map(label => {
    // If it's a gap, the current score is lower
    const gap = gapArray.find(g => g.n.toLowerCase() === label.toLowerCase());
    if (gap) return gap.p;
    
    // If it's in their current skills explicitly, higher score
    if (currentSkills.some(cs => label.toLowerCase().includes(cs))) return 80 + Math.random() * 20;
    
    // Otherwise a low baseline
    return 30 + Math.random() * 30;
  });

  let progress = 0;
  
  function drawRadar(animProgress) {
    ctx.clearRect(0, 0, size, size);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;
    const sides = labels.length;
    const angleStep = (Math.PI * 2) / sides;
    
    // Draw Web
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)'; // Cyberpunk cyan
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const r = (radius / 5) * level;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    labels.forEach((label, i) => {
      const x = centerX + (radius + 20) * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + (radius + 20) * Math.sin(i * angleStep - Math.PI / 2);
      ctx.fillText(label.length > 10 ? label.substring(0, 10) + '...' : label, x, y);
    });
    
    // Draw Data Gradients
    const easeProgress = 1 - Math.pow(1 - animProgress, 3); // easeOutCubic
    
    // Draw Required Data
    drawDataPolygon(dataRequired.map(d => d * easeProgress), 'rgba(255, 0, 128, 0.3)', 'rgba(255, 0, 128, 0.8)', centerX, centerY, radius, sides, angleStep); // Magenta
    
    // Draw Current Data
    drawDataPolygon(dataCurrent.map(d => d * easeProgress), 'rgba(0, 255, 204, 0.4)', 'rgba(0, 255, 204, 1)', centerX, centerY, radius, sides, angleStep); // Cyan
  }
  
  function drawDataPolygon(dataArray, fillColor, strokeColor, centerX, centerY, radius, sides, angleStep) {
    ctx.beginPath();
    dataArray.forEach((val, i) => {
      const r = (val / 100) * radius;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  function animate() {
    progress += 0.02;
    if (progress > 1) progress = 1;
    drawRadar(progress);
    if (progress < 1) requestAnimationFrame(animate);
  }
  
  animate();
}
