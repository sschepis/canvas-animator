import { Vector3 } from './vector';
export type animationFunc = (x: number, y: number, z: number) => number;
export type renderFunc = (context: CanvasRenderingContext2D, x: number, y: number, z: number, value: number, time: number) => boolean;
export type animationStartFunc = () => animationFunc;
export declare class Bounds {
    min: Vector3;
    max: Vector3;
    constructor(min: Vector3, max: Vector3);
}
export declare class Animator {
    bounds: Bounds;
    animation: animationStartFunc;
    renderFunc: renderFunc;
    randomCoords: boolean;
    _stop: boolean;
    _canvas: any;
    _context: any;
    _time: number;
    constructor(canvas: string, bounds: Bounds, animation: animationStartFunc, renderFunc: renderFunc, randomCoords?: boolean);
    iterate(bounds: Bounds, iteratorFunc: any, renderFunc: any, framesCount?: number): boolean;
    iterateRandom(bounds: Bounds, iteratorFunc: any, renderFunc: any, framesCount?: number): boolean;
    animate(framesCount?: number): void;
    stop(): void;
}
