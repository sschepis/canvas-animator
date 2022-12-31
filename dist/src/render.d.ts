import { Animator, Bounds, animationStartFunc, renderFunc } from ".";
export declare const renderFuncDeliverer: (rederFunc: any, initializer?: any, options?: any) => any;
export declare const animationFuncDeliverer: (animationFunc: any, initializer?: any, options?: any) => any;
export declare class ValueTracker {
    _bounds: any;
    constructor();
    value(str: string, val: any): any;
    clear(str: string): void;
}
export declare const valueTracker: ValueTracker;
export declare const rayTracingRenderer: renderFunc;
export declare class RayTracer extends Animator {
    constructor(document: any, canvasId: string, bounds: Bounds, animationFunc: animationStartFunc, renderFunc: renderFunc, initializer?: any, options?: any);
}
