import { expect } from 'chai';
import { Vector3 } from '../src/vector';
import { Bounds, Animator, renderFunc } from '../src/index';

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

describe('Animator', () => {
    it('should initialize', () => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new Animator(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer()
        );
        expect(animator).to.be.instanceOf(Animator);
    });
    it('should iterate', (done) => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new Animator(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer(done)
        );
        let count = 0;
        animator.iterate(
            bounds,
            (x: number, y: number, z: number) => {
                count++;
                return true;
            },
            dummyRenderFuncDeliverer(done)
        );
        expect(count).to.equal(1000000);
    });
    it('should iterate random', (done) => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new Animator(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer(done)
        );
        let count = 0;
        animator.iterateRandom(
            bounds,
            (x: number, y: number, z: number) => {
                count++;
                return true;
            },
            dummyRenderFuncDeliverer(done)
        );
        expect(count).to.equal(1000000);
    });
    it('should animate', () => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new Animator(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer()
        );
        let count = 0;
        animator.animate(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0, false);
        expect(count).to.equal(0);
    });
    it('should stop', () => {
        const bounds = new Bounds(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100)
        );
        const animator = new Animator(
            document,
            'canvas',
            bounds,
            () => [],
            dummyRenderFuncDeliverer()
        );
        let count = 0;
        animator.stop();
        animator.animate(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0, false);
        expect(count).to.equal(0);
    });
});
