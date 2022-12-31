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
                    translate: () => { },
                };
            },
        };
    }
}
const document = new DocumentMock();
const dummyRenderFuncDeliverer = (done) => {
    return (context, position, camera, direction, value, time) => {
        if (done)
            done();
        return { render: true, break: false };
    };
};
describe('Animator', () => {
    it('should initialize', () => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(100, 100, 100));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => [], dummyRenderFuncDeliverer());
        (0, chai_1.expect)(animator).to.be.instanceOf(index_1.Animator);
    });
    it('should iterate', (done) => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(100, 100, 100));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => [], dummyRenderFuncDeliverer(done));
        let count = 0;
        animator.iterate(bounds, (x, y, z) => {
            count++;
            return true;
        }, dummyRenderFuncDeliverer(done));
        (0, chai_1.expect)(count).to.equal(1000000);
    });
    it('should iterate random', (done) => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(100, 100, 100));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => [], dummyRenderFuncDeliverer(done));
        let count = 0;
        animator.iterateRandom(bounds, (x, y, z) => {
            count++;
            return true;
        }, dummyRenderFuncDeliverer(done));
        (0, chai_1.expect)(count).to.equal(1000000);
    });
    it('should animate', () => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(100, 100, 100));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => [], dummyRenderFuncDeliverer());
        let count = 0;
        animator.animate(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(0, 0, 0), 0, false);
        (0, chai_1.expect)(count).to.equal(0);
    });
    it('should stop', () => {
        const bounds = new index_1.Bounds(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(100, 100, 100));
        const animator = new index_1.Animator(document, 'canvas', bounds, () => [], dummyRenderFuncDeliverer());
        let count = 0;
        animator.stop();
        animator.animate(new vector_1.Vector3(0, 0, 0), new vector_1.Vector3(0, 0, 0), 0, false);
        (0, chai_1.expect)(count).to.equal(0);
    });
});
