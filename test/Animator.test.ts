
import { expect } from 'chai';
import { Vector3 } from '../src/vector';
import { Bounds, Animator, renderFunc } from '../src/index';

class DocumentMock {
    getElementById(id: string) {
        return {
            getContext: () => {
                return {
                    translate: () => {}
                }
            }
        }
    }
}
const document = new DocumentMock() as any;

const dummyRenderFunc: renderFunc = (context: any, x: number, y: number, z: number, value: number, time: number) => false;

describe('Animator', () => {
    it('should instantiate', () => {
        const bounds = new Bounds(new Vector3(0, 0, 0), new Vector3(10, 10, 10))
        const animator = new Animator(document, 'canvas', bounds, () => () => 0, (context: any, x: number, y: number, z: number, value: number, time: number) => false)
        expect(animator).to.be.instanceOf(Animator)
    })
    it('should iterate', () => {
        const bounds = new Bounds(new Vector3(0, 0, 0), new Vector3(10, 10, 10))
        let count = 0
        const animator = new Animator(document, 'canvas', bounds, () => () => 0, (context: any, x: number, y: number, z: number, value: number, time: number) => {
            count++
            return true
        })
    })
    it('should iterate random', (done) => {
        const bounds = new Bounds(new Vector3(0, 0, 0), new Vector3(10, 10, 10))
        let count = 0
        const animator = new Animator(document, 'canvas', bounds, () => () => 0, (context: any, x: number, y: number, z: number, value: number, time: number) => {
            count++
            expect(count).to.be.greaterThan(0)
            return true
        })
        animator.iterateRandom(bounds, () => 0, () => {
            done()
            return true;
        })
    })
    it('should animate', (done) => {
        const bounds = new Bounds(new Vector3(0, 0, 0), new Vector3(10, 10, 10))
        let count = 0
        const animator = new Animator(document, 'canvas', bounds, () => () => 0,  (context: any, x: number, y: number, z: number, value: number, time: number) => {
            count++
            return false
        })
        animator.animate(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1)
        setTimeout(() => {
            expect(count).to.be.greaterThan(0)
            done()
        }, 100)
    })
    it('should stop', (done) => {
        const bounds = new Bounds(new Vector3(0, 0, 0), new Vector3(10, 10, 10))
        let count = 0
        const animator = new Animator(document, 'canvas', bounds, () => () => 0,  (context: any, x: number, y: number, z: number, value: number, time: number) => {
            count++
            return false
        })
        animator.animate(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1)
        animator.stop()
        setTimeout(() => {
            expect(count).to.equal(1)
            done()
        });
    })
});

