import { Vector3, Vector2 } from "./vector";

type animationFunc = (x: number, y: number, z: number) => number;
type renderFunc = (
  context: CanvasRenderingContext2D,
  position: Vector3,
  camera: Vector3,
  direction: Vector3,
  value: number,
  time: number
) => { render: boolean; break: boolean };
type animationStartFunc = () => animationFunc[];
class Bounds {
  constructor(public min: Vector3, public max: Vector3) {}
}
const animatorFunc = (callback: any) => {
  try {
    requestAnimationFrame(callback);
  } catch (e) {
    setTimeout(callback, 1000 / 60);
  }
};
const random = (min: number, max: number) => Math.random() * (max - min) + min;
class Animator {
  _stop: boolean = false;
  _canvas: any;
  _context: any;
  _time: number = 0;
  _cameraPosition: Vector3 = new Vector3(0, 0, 0);
  _cameraDirection: Vector3 = new Vector3(0, 0, 0);
  constructor(
    public document: any,
    canvas: string,
    public bounds: Bounds,
    public animation: animationStartFunc,
    public renderFunc: renderFunc,
    public randomCoords: boolean = false,
    public step: number = 1
  ) {
    this._canvas = this.document.getElementById(canvas) as HTMLCanvasElement;
    this._context = this._canvas.getContext("2d");
    this._canvas.width = this.bounds.max.x - this.bounds.min.x;
    this._canvas.height = this.bounds.max.y - this.bounds.min.y;
    if (this._context)
      this._context.translate(this._canvas.width / 2, this._canvas.height / 2);
    this.animate = this.animate.bind(this);
  }
  iterate(
    bounds: Bounds,
    iteratorFunc: any,
    renderFunc: any,
    framesCount: number = 0,
    step = this.step
  ) {
    let renderVal = false,
      frames = 0,
      _break = false;
    for (let x = bounds.min.x; x < bounds.max.x; x+=step) {
      for (let y = bounds.min.y; y < bounds.max.y; y+=step) {
        for (let z = bounds.min.z; z < bounds.max.z; z+=step) {
          const result = iteratorFunc(x, y, z);
          const position = new Vector3(x, y, z);
          renderVal = renderFunc(this._context, position, this._cameraPosition, this._cameraDirection, result, this._time);
          frames++;
          if (framesCount && frames >= framesCount) {
            _break = true;
            break;
          }
          if (renderVal) {
            _break = true;
            break;
          }
        }
        if (_break) break;
      }
      if (_break) break;
    }
    return renderVal;
  }
  iterateRandom(
    bounds: Bounds,
    iteratorFunc: any,
    renderFunc: any,
    framesCount: number = 0
  ) {
    let renderVal = false,
      frames = 0;
    const size =
      (bounds.max.x - bounds.min.x) *
      (bounds.max.y - bounds.min.y) *
      (bounds.max.z - bounds.min.z);
    for (let i = 0; i < size; i++) {
      const x = random(bounds.min.x, bounds.max.x);
      const y = random(bounds.min.y, bounds.max.y);
      const z = random(bounds.min.z, bounds.max.z);
      const position = new Vector3(x, y, z);
      const result = iteratorFunc(x, y, z);
      renderVal = renderFunc(this._context, position, this._cameraPosition, this._cameraDirection, result, this._time);
      frames++;
      if (framesCount && frames >= framesCount) break;
      if (renderVal) break;
    }
    return renderVal;
  }
  animate(
    caneraPosition: Vector3,
    caneraDirection: Vector3,
    framesCount: number = 0,
    loop: boolean = true
  ) {
    if (!this._context) {
      if (!this._stop)
        animatorFunc(() =>
          this.animate(caneraPosition, caneraDirection, framesCount)
        );
      return;
    }
    const animations = this.animation();
    let renderVal = undefined;
    this._cameraPosition = caneraPosition;
    this._cameraDirection = caneraDirection;
    const renderOne = (animation: animationFunc) => {
      if (this.randomCoords)
        renderVal = this.iterateRandom(
          this.bounds,
          animation,
          this.renderFunc,
          framesCount
        );
      else
        renderVal = this.iterate(
          this.bounds,
          animation,
          this.renderFunc,
          framesCount
        );
      return renderVal;
    }
    for (let i = 0; i < animations.length; i++) {
      renderVal = renderOne(animations[i]);
      if (renderVal) break;
    }
    if (!this._stop && !renderVal && loop)
      animatorFunc(() =>
        this.animate(caneraPosition, caneraDirection, framesCount)
      );
    this._time += 1;
  }
  stop() {
    this._stop = true;
  }
}

export {
  Vector3,
  Vector2,
  Animator,
  Bounds,
  animationFunc,
  renderFunc,
  animationStartFunc,
};
