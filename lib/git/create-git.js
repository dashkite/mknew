"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGit = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const node_path_1 = __importDefault(require("node:path"));
const git_error_1 = require("./git-error");
/**
 * Create a Git command runner bound to a working directory. Git command output
 * is returned (stdout + stderr). If the command exits with a non-zero code,
 * then a `GitError` is thrown.
 */
const createGit = (cwd) => {
    return async (...args) => {
        const process = (0, cross_spawn_1.default)('git', args, { cwd: node_path_1.default.resolve(cwd), stdio: 'overlapped' });
        return new Promise((resolve, reject) => {
            const buffers = [];
            process.stdout?.on('data', (data) => buffers.push(data));
            process.stderr?.on('data', (data) => buffers.push(data));
            process.on('error', reject);
            process.on('exit', (exitCode) => {
                const output = Buffer.concat(buffers).toString('utf-8').trim();
                if (exitCode !== 0) {
                    reject(new git_error_1.GitError(exitCode ?? 1, output));
                }
                else {
                    resolve(output);
                }
            });
        });
    };
};
exports.createGit = createGit;
//# sourceMappingURL=create-git.js.map