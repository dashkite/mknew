"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitIgnored = void 0;
const node_path_1 = __importDefault(require("node:path"));
const create_git_1 = require("./create-git");
/**
 * List all Git ignored files (absolute paths). All files in the Git _root_ are
 * listed, even if `path` is not the root.
 */
const getGitIgnored = async (path) => {
    try {
        const git = (0, create_git_1.createGit)(path);
        const root = await git('rev-parse', '--show-toplevel');
        const output = await git('status', '--ignored', '--porcelain');
        const lines = output.split(/\r?\n/g);
        return lines
            .filter((line) => line.startsWith('!! '))
            .map((line) => line.slice(3))
            .map((line) => node_path_1.default.resolve(root, line));
    }
    catch (error) {
        return [];
    }
};
exports.getGitIgnored = getGitIgnored;
//# sourceMappingURL=get-git-ignored.js.map