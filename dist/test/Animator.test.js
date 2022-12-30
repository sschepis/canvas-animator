"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vector_1 = require("../src/vector");
const index_1 = require("../src/index");
class DocumentMock {
    getElementById(id) {
        return {
            getContext: () => {
                return {
                    translate: () => { }
                };
            }
        };
    }
}
const document = new DocumentMock();
const dummyRenderFunc = (context, x, y, z, value, time) => false;
describe('Animator', () => {
    it('should instantiate', () => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(10, 10, 10));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => () => 0, (context, x, y, z, value, time) => false);
        (0, chai_1.expect)(animator).to.be.instanceOf(index_1.Animator);
    });
    it('should iterate', () => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(10, 10, 10));
        let count = 0;
        const animator = new index_1.Animator(document, 'canvas', bounds, () => () => 0, (context, x, y, z, value, time) => {
            count++;
            return true;
        });
    });
    it('should iterate random', (done) => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(10, 10, 10));
        let count = 0;
        const animator = new index_1.Animator(document, 'canvas', bounds, () => () => 0, (context, x, y, z, value, time) => {
            count++;
            (0, chai_1.expect)(count).to.be.greaterThan(0);
            return true;
        });
        animator.iterateRandom(bounds, () => 0, () => {
            done();
            return true;
        });
    });
    it('should animate', (done) => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(10, 10, 10));
        let count = 0;
        const animator = new index_1.Animator(document, 'canvas', bounds, () => () => 0, (context, x, y, z, value, time) => {
            count++;
            return false;
        });
        animator.animate(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(0, 0, 0), 1);
        setTimeout(() => {
            (0, chai_1.expect)(count).to.be.greaterThan(0);
            done();
        }, 100);
    });
    it('should stop', (done) => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(10, 10, 10));
        let count = 0;
        const animator = new index_1.Animator(document, 'canvas', bounds, () => () => 0, (context, x, y, z, value, time) => {
            count++;
            return false;
        });
        animator.animate(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(0, 0, 0), 1);
        animator.stop();
        setTimeout(() => {
            (0, chai_1.expect)(count).to.equal(1);
            done();
        });
    });
});
