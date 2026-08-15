// One-Euro фильтр: на покое сильно сглаживает дрожание, при быстром движении почти не отстаёт.
class LowPass {
  private s = 0;
  private started = false;
  filter(x: number, alpha: number): number {
    if (!this.started) {
      this.s = x;
      this.started = true;
    } else {
      this.s = alpha * x + (1 - alpha) * this.s;
    }
    return this.s;
  }
}

export class OneEuro {
  private xPrev = 0;
  private tPrev: number | null = null;
  private readonly xLp = new LowPass();
  private readonly dxLp = new LowPass();

  constructor(
    private minCutoff = 1.5,
    private beta = 0.02,
    private dCutoff = 1.0,
  ) {}

  // живая настройка (debug-слайдеры)
  set(minCutoff: number, beta: number) {
    this.minCutoff = minCutoff;
    this.beta = beta;
  }

  private alpha(cutoff: number, dt: number): number {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }

  filter(x: number, t: number): number {
    if (this.tPrev === null) {
      this.tPrev = t;
      this.xPrev = x;
      return x;
    }
    const dt = Math.max(1e-3, t - this.tPrev);
    this.tPrev = t;
    const dx = (x - this.xPrev) / dt;
    const edx = this.dxLp.filter(dx, this.alpha(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const out = this.xLp.filter(x, this.alpha(cutoff, dt));
    this.xPrev = x;
    return out;
  }
}
