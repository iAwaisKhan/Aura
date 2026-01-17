declare global {
  interface CanvasRenderingContext2D {
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    fillStyle: string | CanvasGradient | CanvasPattern;
    fill(): void;
    clearRect(x: number, y: number, w: number, h: number): void;
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  amplitude: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = 2 + Math.random() * 1.5;
    this.phase = Math.random() * Math.PI * 2;
    this.amplitude = 0.3 + Math.random() * 0.2;
  }

  update(canvas: HTMLCanvasElement): void {
    this.phase += 0.01;
    this.x += this.vx + Math.sin(this.phase) * this.amplitude * 0.1;
    this.y += this.vy + Math.cos(this.phase * 0.7) * this.amplitude * 0.1;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

export function initNetworkAnimation(): void {
  const canvas = document.getElementById('networkCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  function resizeCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getParticleColor(): string {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'rgba(205, 145, 115, 0.4)' : 'rgba(165, 98, 68, 0.3)';
  }

  const particles: Particle[] = [];
  for (let i = 0; i < 35; i++) {
    particles.push(new Particle(canvas));
  }

  function animate(): void {
    (ctx as CanvasRenderingContext2D).clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p: Particle) => {
      p.update(canvas);
      p.draw(ctx as CanvasRenderingContext2D, getParticleColor());
    });
    requestAnimationFrame(animate);
  }
  animate();
}
