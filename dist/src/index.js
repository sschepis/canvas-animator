"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueTracker = exports.animationFuncDeliverer = exports.renderFuncDeliverer = exports.ValueTracker = exports.RayTracer = exports.Bounds = exports.Animator = exports.Vector2 = exports.Vector3 = void 0;
const vector_1 = require("./vector");
Object.defineProperty(exports, "Vector3", { enumerable: true, get: function () { return vector_1.Vector3; } });
Object.defineProperty(exports, "Vector2", { enumerable: true, get: function () { return vector_1.Vector2; } });
const render_1 = require("./render");
Object.defineProperty(exports, "ValueTracker", { enumerable: true, get: function () { return render_1.ValueTracker; } });
Object.defineProperty(exports, "renderFuncDeliverer", { enumerable: true, get: function () { return render_1.renderFuncDeliverer; } });
Object.defineProperty(exports, "animationFuncDeliverer", { enumerable: true, get: function () { return render_1.animationFuncDeliverer; } });
Object.defineProperty(exports, "RayTracer", { enumerable: true, get: function () { return render_1.RayTracer; } });
Object.defineProperty(exports, "valueTracker", { enumerable: true, get: function () { return render_1.valueTracker; } });
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
const random = (min, max) => Math.random() * (max - min) + min;
class Animator {
    constructor(document, canvas, bounds, animation, renderFunc, randomCoords = false, step = 1) {
        this.document = document;
        this.bounds = bounds;
        this.animation = animation;
        this.renderFunc = renderFunc;
        this.randomCoords = randomCoords;
        this.step = step;
        this._stop = false;
        this._time = 0;
        this._cameraPosition = new vector_1.Vector3(0, 0, 0);
        this._cameraDirection = new vector_1.Vector3(0, 0, 0);
        this._canvas = this.document.getElementById(canvas);
        this._context = this._canvas.getContext("2d");
        this._canvas.width = this.bounds.max.x - this.bounds.min.x;
        this._canvas.height = this.bounds.max.y - this.bounds.min.y;
        if (this._context)
            this._context.translate(this._canvas.width / 2, this._canvas.height / 2);
        this.animate = this.animate.bind(this);
    }
    iterate(bounds, iteratorFunc, renderFunc, framesCount = 0, step = this.step) {
        let renderVal = false, frames = 0, _break = false;
        for (let x = bounds.min.x; x < bounds.max.x; x += step) {
            for (let y = bounds.min.y; y < bounds.max.y; y += step) {
                for (let z = bounds.min.z; z < bounds.max.z; z += step) {
                    const result = iteratorFunc(x, y, z);
                    const position = new vector_1.Vector3(x, y, z);
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
        const size = (bounds.max.x - bounds.min.x) *
            (bounds.max.y - bounds.min.y) *
            (bounds.max.z - bounds.min.z);
        for (let i = 0; i < size; i++) {
            const x = random(bounds.min.x, bounds.max.x);
            const y = random(bounds.min.y, bounds.max.y);
            const z = random(bounds.min.z, bounds.max.z);
            const position = new vector_1.Vector3(x, y, z);
            const result = iteratorFunc(x, y, z);
            renderVal = renderFunc(this._context, position, this._cameraPosition, this._cameraDirection, result, this._time);
            frames++;
            if (framesCount && frames >= framesCount)
                break;
            if (renderVal)
                break;
        }
        return renderVal;
    }
    animate(caneraPosition, caneraDirection, framesCount = 0, loop = true) {
        if (!this._context) {
            if (!this._stop)
                animatorFunc(() => this.animate(caneraPosition, caneraDirection, framesCount));
            return;
        }
        const animations = this.animation();
        let renderVal = undefined;
        this._cameraPosition = caneraPosition;
        this._cameraDirection = caneraDirection;
        const renderOne = (animation) => {
            if (this.randomCoords)
                renderVal = this.iterateRandom(this.bounds, animation, this.renderFunc, framesCount);
            else
                renderVal = this.iterate(this.bounds, animation, this.renderFunc, framesCount);
            return renderVal;
        };
        for (let i = 0; i < animations.length; i++) {
            renderVal = renderOne(animations[i]);
            if (renderVal)
                break;
        }
        if (!this._stop && !renderVal && loop)
            animatorFunc(() => this.animate(caneraPosition, caneraDirection, framesCount));
        this._time += 1;
    }
    stop() {
        this._stop = true;
    }
}
exports.Animator = Animator;
