"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTasks = void 0;
const node_os_1 = __importDefault(require("node:os"));
/**
 * Run all async task functions with limited concurrency.
 *
 * Default concurrency is CPU count + 1.
 */
const runTasks = async (tasks, { concurrency = node_os_1.default.cpus().length + 1, onError = async (error) => {
    throw error;
}, } = {}) => {
    const active = new Set();
    concurrency = Math.max(1, Math.ceil(concurrency));
    for (const task of tasks) {
        const promise = task().catch(onError);
        active.add(promise);
        void promise.then(() => active.delete(promise));
        if (active.size >= concurrency) {
            await Promise.any([...active]);
        }
    }
    await Promise.all([...active]);
};
exports.runTasks = runTasks;
//# sourceMappingURL=run-tasks.js.map