import { Vector3, Vector2 } from './vector';
type animationFunc = (x: number, y: number, z: number) => number;
type renderFunc = (context: CanvasRenderingContext2D, x: number, y: number, z: number, value: number, time: number) => boolean;
type animationStartFunc = () => animationFunc;
declare class Bounds {
    min: Vector3;
    max: Vector3;
    constructor(min: Vector3, max: Vector3);
}
declare class Animator {
    document: any;
    bounds: Bounds;
    animation: animationStartFunc;
    renderFunc: renderFunc;
    randomCoords: boolean;
    _stop: boolean;
    _canvas: any;
    _context: any;
    _time: number;
    _cameraPosition: Vector3;
    _cameraDirection: Vector3;
    constructor(document: any, canvas: string, bounds: Bounds, animation: animationStartFunc, renderFunc: renderFunc, randomCoords?: boolean);
    iterate(bounds: Bounds, iteratorFunc: any, renderFunc: any, framesCount?: number): boolean;
    iterateRandom(bounds: Bounds, iteratorFunc: any, renderFunc: any, framesCount?: number): boolean;
    animate(caneraPosition: Vector3, caneraDirection: Vector3, framesCount?: number, loop?: boolean): void;
    stop(): void;
}
export { Vector3, Vector2, Animator, Bounds, animationFunc, renderFunc, animationStartFunc };
