"use strict";
// a ray-tracer written in TypeScript for the browser and 2d canvas. Uses the Animator class to iterate over the canvas and render the scene.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayTracer = exports.rayTracingRenderer = exports.valueTracker = exports.ValueTracker = exports.animationFuncDeliverer = exports.renderFuncDeliverer = void 0;
const _1 = require(".");
const renderFuncDeliverer = (rederFunc, initializer, options) => {
    if (initializer) {
        rederFunc = initializer(options, rederFunc);
    }
    return rederFunc;
};
exports.renderFuncDeliverer = renderFuncDeliverer;
const animationFuncDeliverer = (animationFunc, initializer, options) => {
    if (initializer) {
        animationFunc = initializer(options, animationFunc);
    }
    return animationFunc;
};
exports.animationFuncDeliverer = animationFuncDeliverer;
class ValueTracker {
    constructor() {
        this._bounds = {};
        this._bounds = {};
    }
    value(str, val) {
        if (str) {
            if (!val) {
                if (!this._bounds[str]) {
                    this._bounds[str] = {
                        min: val,
                        max: val,
                        value: val
                    };
                }
                else {
                    if (val < this._bounds[str].min) {
                        this._bounds[str].min = val;
                    }
                    if (val > this._bounds[str].max) {
                        this._bounds[str].max = val;
                    }
                    this._bounds[str].value = val;
                }
            }
            else
                return this._bounds[str];
        }
        return undefined;
    }
    clear(str) {
        if (str) {
            delete this._bounds[str];
        }
    }
}
exports.ValueTracker = ValueTracker;
exports.valueTracker = new ValueTracker();
const rayTracingRenderer = (context, position, camera, direction, value, time) => {
    // use the value in value to determine the color of the pixel
    // bounds of value are variable, so we need to track them
    const bounds = exports.valueTracker.value("value", value);
    const min = bounds.min;
    const max = bounds.max;
    const val = bounds.value;
    const color = Math.floor((val - min) / (max - min) * 255);
    context.fillStyle = `rgb(${color}, ${color}, ${color})`;
    context.fillRect(position.x, position.y, 1, 1);
    return { render: true, break: false };
};
exports.rayTracingRenderer = rayTracingRenderer;
class RayTracer extends _1.Animator {
    constructor(document, canvasId, bounds, animationFunc, renderFunc, initializer, options) {
        super(document, canvasId, bounds, (0, exports.animationFuncDeliverer)(animationFunc, initializer, options), (0, exports.renderFuncDeliverer)(exports.rayTracingRenderer));
    }
}
exports.RayTracer = RayTracer;
