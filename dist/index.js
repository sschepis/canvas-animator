"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animator = exports.Bounds = void 0;
class Bounds {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
}
exports.Bounds = Bounds;
class Animator {
    constructor(canvas, bounds, animation, renderFunc, randomCoords = false) {
        this.bounds = bounds;
        this.animation = animation;
        this.renderFunc = renderFunc;
        this.randomCoords = randomCoords;
        this._stop = false;
        this._time = 0;
        this._canvas = document.getElementById(canvas);
        ;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        if (this._context)
            this._context.translate(this._canvas.width / 2, this._canvas.height / 2);
        this.animate = this.animate.bind(this);
        this.animate();
    }
    iterate(bounds, iteratorFunc, renderFunc, framesCount = 0) {
        let renderVal = false, frames = 0;
        for (let x = bounds.min.x; x < bounds.max.x; x++) {
            for (let y = bounds.min.y; y < bounds.max.y; y++) {
                for (let z = bounds.min.z; z < bounds.max.x; z++) {
                    const result = iteratorFunc(x, y, z);
                    renderVal = renderFunc(this._context, x, y, z, result, this._time);
                    frames++;
                    if (framesCount && frames >= framesCount)
                        break;
                    if (renderVal)
                        break;
                }
            }
        }
        return renderVal;
    }
    iterateRandom(bounds, iteratorFunc, renderFunc, framesCount = 0) {
        let renderVal = false, frames = 0;
        const size = bounds.max.x * bounds.max.y * bounds.max.z;
        for (let i = 0; i < size; i++) {
            const x = Math.floor(Math.random() * bounds.max.x);
            const y = Math.floor(Math.random() * bounds.max.y);
            const z = Math.floor(Math.random() * bounds.max.z);
            const result = iteratorFunc(x, y, z);
            renderVal = renderFunc(this._context, x, y, z, result, this._time);
            frames++;
            if (framesCount && frames >= framesCount)
                break;
            if (renderVal)
                break;
        }
        return renderVal;
    }
    animate(framesCount = 0) {
        if (!this._context) {
            if (!this._stop)
                requestAnimationFrame(this.animate);
            return;
        }
        const animation = this.animation();
        const x = 0;
        const y = 0;
        const z = 0;
        let renderVal = undefined;
        if (this.randomCoords)
            renderVal = this.iterateRandom(this.bounds, animation, this.renderFunc, framesCount);
        else
            renderVal = this.iterate(this.bounds, animation, this.renderFunc);
        if (!this._stop && !renderVal)
            requestAnimationFrame(this.animate);
        this._time += 1;
    }
    stop() {
        this._stop = true;
    }
}
exports.Animator = Animator;
