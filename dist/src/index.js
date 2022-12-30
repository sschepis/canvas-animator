"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounds = exports.Animator = exports.Vector2 = exports.Vector3 = void 0;
const vector_1 = require("./vector");
Object.defineProperty(exports, "Vector3", { enumerable: true, get: function () { return vector_1.Vector3; } });
Object.defineProperty(exports, "Vector2", { enumerable: true, get: function () { return vector_1.Vector2; } });
class Bounds {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
}
exports.Bounds = Bounds;
const animatorFunc = (callback) => {
    try {
        requestAnimationFrame(callback);
    }
    catch (e) {
        setTimeout(callback, 1000 / 60);
    }
};
class Animator {
    constructor(document, canvas, bounds, animation, renderFunc, randomCoords = false) {
        this.document = document;
        this.bounds = bounds;
        this.animation = animation;
        this.renderFunc = renderFunc;
        this.randomCoords = randomCoords;
        this._stop = false;
        this._time = 0;
        this._cameraPosition = new vector_1.Vector3(0, 0, 0);
        this._cameraDirection = new vector_1.Vector3(0, 0, 0);
        this._canvas = this.document.getElementById(canvas);
        ;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = this.bounds.max.x - this.bounds.min.x;
        this._canvas.height = this.bounds.max.y - this.bounds.min.y;
        if (this._context)
            this._context.translate(this._canvas.width / 2, this._canvas.height / 2);
        this.animate = this.animate.bind(this);
    }
    iterate(bounds, iteratorFunc, renderFunc, framesCount = 0) {
        let renderVal = false, frames = 0, _break = false;
        for (let x = bounds.min.x; x < bounds.max.x; x++) {
            for (let y = bounds.min.y; y < bounds.max.y; y++) {
                for (let z = bounds.min.z; z < bounds.max.x; z++) {
                    const result = iteratorFunc(x, y, z);
                    renderVal = renderFunc(this._context, x, y, z, result, this._time);
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
                if (_break)
                    break;
            }
            if (_break)
                break;
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
    animate(caneraPosition, caneraDirection, framesCount = 0) {
        if (!this._context) {
            if (!this._stop)
                animatorFunc(() => this.animate(caneraPosition, caneraDirection, framesCount));
            return;
        }
        const animation = this.animation();
        let renderVal = undefined;
        this._cameraPosition = caneraPosition;
        this._cameraDirection = caneraDirection;
        if (this.randomCoords)
            renderVal = this.iterateRandom(this.bounds, animation, this.renderFunc, framesCount);
        else
            renderVal = this.iterate(this.bounds, animation, this.renderFunc, framesCount);
        if (!this._stop && !renderVal)
            animatorFunc(() => this.animate(caneraPosition, caneraDirection, framesCount));
        this._time += 1;
    }
    stop() {
        this._stop = true;
    }
}
exports.Animator = Animator;
