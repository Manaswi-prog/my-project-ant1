/**
 * @file radar.js
 * @description Animated Canvas-based radar chart for visualizing career skill gaps.
 * Deterministic scoring — no Math.random() used, scores derived directly from gap data.
 */

/**
 * Initialises and animates the skill gap radar chart on a canvas element.
 * @param {Object} data - The structured career data object from Gemini or fallback engine.
 * @param {string[]} data.skills - Array of required skill names.
 * @param {Array<{n: string, p: number, l: string}>} data.gaps - Skill gap array with name, percentage, and level.
 * @param {number} data.match - Overall career match percentage used to set the current-skill baseline.
 * @returns {void}
 */
export function initRadarChart(data) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) {return;}

  const ctx = canvas.getContext('2d');
  if (!ctx) {return;}

  // High-DPI / Retina display support
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  // Build deterministic label set from the skill gap array (max 6 for clarity)
  const labels = data.gaps.slice(0, 6).map(g => g.n);

  /**
   * Required skill levels — always at a high baseline (90) to represent
   * the industry standard required for the target role.
   * @type {number[]}
   */
  const dataRequired = labels.map(() => 90);

  /**
   * Current user levels — derived deterministically from the gap percentage.
   * Lower gap.p means a stronger existing skill. We invert: current = 100 - gap.p.
   * This ensures the visualization is consistent and reproducible across renders.
   * @type {number[]}
   */
  const dataCurrent = data.gaps.slice(0, 6).map(gap => Math.max(10, 100 - gap.p));

  let animProgress = 0;

  /**
   * Draws all elements of the radar for the given animation progress frame.
   * @param {number} progress - Animation progress from 0 to 1.
   */
  function drawRadar(progress) {
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;
    const sides = labels.length;
    const angleStep = (Math.PI * 2) / sides;

    // Draw concentric web rings
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const r = (radius / 5) * level;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
        if (i === 0) {ctx.moveTo(x, y);}
        else {ctx.lineTo(x, y);}
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines from center to each vertex
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.1)';
    for (let i = 0; i < sides; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(i * angleStep - Math.PI / 2),
        centerY + radius * Math.sin(i * angleStep - Math.PI / 2)
      );
      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = `${10 * dpr / dpr}px Sora, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    labels.forEach((label, i) => {
      const x = centerX + (radius + 22) * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + (radius + 22) * Math.sin(i * angleStep - Math.PI / 2);
      const shortLabel = label.length > 10 ? label.substring(0, 10) + '…' : label;
      ctx.fillText(shortLabel, x, y);
    });

    // Ease-in-out cubic for smooth animation
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Draw required skill polygon (magenta = target)
    drawDataPolygon(
      dataRequired.map(d => d * easeProgress),
      'rgba(255, 0, 128, 0.25)',
      'rgba(255, 0, 128, 0.85)',
      centerX, centerY, radius, sides, angleStep
    );

    // Draw current skill polygon (cyan = where user is now)
    drawDataPolygon(
      dataCurrent.map(d => d * easeProgress),
      'rgba(0, 255, 204, 0.35)',
      'rgba(0, 255, 204, 1)',
      centerX, centerY, radius, sides, angleStep
    );
  }

  /**
   * Draws a filled polygon for a given data set on the radar.
   * @param {number[]} dataArray - Normalised values (0–100) for each axis.
   * @param {string} fillColor - CSS fill color string.
   * @param {string} strokeColor - CSS stroke color string.
   * @param {number} cx - Canvas center X.
   * @param {number} cy - Canvas center Y.
   * @param {number} r - Outer radius.
   * @param {number} sides - Number of polygon vertices.
   * @param {number} step - Angle step per vertex.
   */
  function drawDataPolygon(dataArray, fillColor, strokeColor, cx, cy, r, sides, step) {
    ctx.beginPath();
    dataArray.forEach((val, i) => {
      const pr = (val / 100) * r;
      const x = cx + pr * Math.cos(i * step - Math.PI / 2);
      const y = cy + pr * Math.sin(i * step - Math.PI / 2);
      if (i === 0) {ctx.moveTo(x, y);}
      else {ctx.lineTo(x, y);}
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  /**
   * Animation loop — runs until progress reaches 1.
   */
  function animate() {
    animProgress += 0.02;
    if (animProgress > 1) {animProgress = 1;}
    drawRadar(animProgress);
    if (animProgress < 1) {requestAnimationFrame(animate);}
  }

  animate();
}

/**
 * Clears and redraws the radar chart with new data.
 * @param {Object} data - Updated career data object.
 */
export function updateRadarChart(data) {
  initRadarChart(data);
}
