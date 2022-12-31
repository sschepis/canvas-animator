import { expect } from 'chai';
import { Bounds } from '../src/index';
import { Vector3 } from '../src/vector';
import { RayTracer } from '../src/render';

class DocumentMock {
    getElementById(id: string) {
        return {
            getContext: () => {
                return {
                    translate: () => {},
                };
            },
        };
    }
}

const document = new DocumentMock() as any;

const dummyRenderFuncDeliverer = (done?: any) => {
    return  (
        context: any,
        position: Vector3,
        camera: Vector3,
        direction: Vector3,
        value: number,
        time: number
    ) => {
        if(done) done();
        return { render: true, break: false };
    };
}

describe('RayTracer', () => {
    it('should initialize', () => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new RayTracer(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer()
        );
        expect(animator).to.be.instanceOf(RayTracer);
    });
});
