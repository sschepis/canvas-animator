// a ray-tracer written in TypeScript for the browser and 2d canvas. Uses the Animator class to iterate over the canvas and render the scene.

import { Animator, Bounds, Vector3, Vector2, animationStartFunc, renderFunc } from ".";

export const renderFuncDeliverer = (rederFunc: any, initializer?: any, options?: any) => {
    if(initializer) {
        rederFunc = initializer(options, rederFunc);
    }
    return rederFunc;
}

export const animationFuncDeliverer = (animationFunc: any, initializer?: any, options?: any) => {
    if(initializer) {
        animationFunc = initializer(options, animationFunc);
    }
    return animationFunc;
}

export class ValueTracker {
    _bounds: any = {}
    constructor() {
        this._bounds = {};
    }
    value(str: string, val: any): any {
        if(str) {
            if(!val) {
                if(!this._bounds[str]) {
                    this._bounds[str] = {
                        min: val,
                        max: val,
                        value: val
                    }
                } else {
                    if(val < this._bounds[str].min) {
                        this._bounds[str].min = val;
                    }
                    if(val > this._bounds[str].max) {
                        this._bounds[str].max = val;
                    }
                    this._bounds[str].value = val;
                }
            } else
            return this._bounds[str];
        }
        return undefined;
    }
    clear(str: string) {
        if(str) {
            delete this._bounds[str];
        }
    }
}

export const valueTracker = new ValueTracker();

export const rayTracingRenderer: renderFunc = (
    context: CanvasRenderingContext2D,
    position: Vector3,
    camera: Vector3,
    direction: Vector3,
    value: number,
    time: number    
) => {
    // use the value in value to determine the color of the pixel
    // bounds of value are variable, so we need to track them
    const bounds = valueTracker.value("value", value);
    const min = bounds.min;
    const max = bounds.max;
    const val = bounds.value;
    const color = Math.floor((val - min) / (max - min) * 255);
    context.fillStyle = `rgb(${color}, ${color}, ${color})`;
    context.fillRect(position.x, position.y, 1, 1);
    return { render: true, break: false };
}

export class RayTracer extends Animator {
    constructor(
        document: any,
        canvasId: string,
        bounds: Bounds,
        animationFunc: animationStartFunc,
        renderFunc: renderFunc,
        initializer?: any,
        options?: any
    ) {
        super(document, canvasId, bounds, animationFuncDeliverer(animationFunc, initializer, options), renderFuncDeliverer(rayTracingRenderer));
    }
}
