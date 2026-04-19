export function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  
  if (!dot || !ring) {return;}

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;

  // Instantly track dot
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    
    // Update hologram rotation globally
    const rotX = (mouseY / window.innerHeight - 0.5) * -30;
    const rotY = (mouseX / window.innerWidth - 0.5) * 30;
    document.documentElement.style.setProperty('--rot-x', `${rotX}deg`);
    document.documentElement.style.setProperty('--rot-y', `${rotY}deg`);
  });

  // Lerp track ring
  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animateRing = () => {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  // Hover states
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (
      target.tagName === 'BUTTON' || 
      target.tagName === 'A' || 
      (target.tagName === 'INPUT' && target.type === 'range') ||
      target.classList.contains('ix') || target.closest('.ix') || target.closest('button') || target.closest('a')
    ) {
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (
      target.tagName === 'BUTTON' || 
      target.tagName === 'A' || 
      (target.tagName === 'INPUT' && target.type === 'range') ||
      target.classList.contains('ix') || target.closest('.ix') || target.closest('button') || target.closest('a')
    ) {
      ring.classList.remove('hover');
    }
  });
}
