export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#00f5ff','#8b5cf6','#f472b6','#a78bfa','#34d399','#fbbf24','#60a5fa'];
    this.mouse = { x: -1000, y: -1000 };
    this.repelRadius = 90;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('click', (e) => this.burst(e.clientX, e.clientY));

    // Initialize ambient particles
    for (let i = 0; i < 150; i++) {
        const p = this.createParticle(true);
        this.particles.push(p);
    }
    
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 10,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 0.6 + 0.2),
      size: Math.random() * 2 + 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: Math.random() * 0.7 + 0.3,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      burst: false
    };
  }

  burst(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        burst: true
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];

      // Mouse repel
      let dx = p.x - this.mouse.x;
      let dy = p.y - this.mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (!p.burst && dist < this.repelRadius) {
        let force = (this.repelRadius - dist) / this.repelRadius;
        p.vx += (dx / dist) * force * 0.8;
        p.vy += (dy / dist) * force * 0.8;
      }

      // Physics
      p.x += p.vx;
      p.y += p.vy;

      // Friction for bursts
      if (p.burst) {
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.alpha -= 0.012;
      } else {
        // Friction back to normal velocity for ambient
        p.vx *= 0.99;
        if (Math.abs(p.vx) > 0.4) p.vx *= 0.9;
        if (p.vy > -0.2) p.vy -= 0.01;
      }

      // Draw
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      
      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }

      // Recycle or Remove
      if (p.burst && p.alpha <= 0) {
        this.particles.splice(i, 1);
      } else if (!p.burst && p.y < -10) {
        this.particles[i] = this.createParticle();
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(this.animate);
  }
}

export function initParticles(canvasId) {
  new ParticleSystem(canvasId);
}
