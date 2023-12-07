"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const get_git_ignored_1 = require("../git/get-git-ignored");
/**
 * Iterate over all files (not directories) starting at root.
 *
 * Files matched by `.gitignore` are skipped (_only_ when `root` is tracked by
 * Git).
 */
const getFiles = async function* (path) {
    const stats = await promises_1.default.stat(path);
    if (!stats.isDirectory()) {
        yield '.';
        return;
    }
    const ignored = await (0, get_git_ignored_1.getGitIgnored)(path);
    const ls = async function* (subPath) {
        const entries = await promises_1.default.readdir(node_path_1.default.join(path, subPath), { withFileTypes: true });
        const directories = [];
        for (const entry of entries) {
            const entryPath = node_path_1.default.join(subPath, entry.name);
            if (entry.name === '.git' || ignored.includes(node_path_1.default.resolve(path, entryPath))) {
                continue;
            }
            if (entry.isDirectory()) {
                directories.push(entryPath);
            }
            else {
                yield entryPath;
            }
        }
        for (const directory of directories) {
            yield* ls(directory);
        }
    };
    yield* ls('.');
};
exports.getFiles = getFiles;
//# sourceMappingURL=get-files.js.map