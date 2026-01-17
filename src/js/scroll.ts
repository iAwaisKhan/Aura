declare global {
  class Lenis {
    constructor(options: any);
    raf(time: number): void;
    scrollTo(target: number, options?: any): void;
    start(): void;
  }
}

export function initLenisScroll(): Lenis | null {
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis scroll library not found. Falling back to default scroll.');
    return null;
  }

  const lenis = new Lenis({
    duration: 0.8,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
    lerp: 0.1
  });

  function raf(time: number): void {
    if (lenis) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
  }

  requestAnimationFrame(raf);
  return lenis;
}
