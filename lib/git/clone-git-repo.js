"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneGitRepo = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const create_git_1 = require("./create-git");
/**
 * Clone a git repository into a temporary directory, and return the temporary
 * directory path.
 */
const cloneGitRepo = async ({ url, path = '', branch }, subPath = '') => {
    const temporaryRoot = node_path_1.default.join(node_os_1.default.tmpdir(), 'mknew');
    await promises_1.default.mkdir(temporaryRoot, { recursive: true });
    const temporary = await promises_1.default.mkdtemp(temporaryRoot + node_path_1.default.sep);
    try {
        const git = (0, create_git_1.createGit)(temporary);
        await git('init');
        await git('config', 'core.sparseCheckout', 'true');
        await git('remote', 'add', '-f', 'origin', url);
        await promises_1.default.writeFile(node_path_1.default.join(temporary, '.git', 'info', 'sparse-checkout'), node_path_1.default.posix.join('/', path, subPath.replaceAll('\\', '/'), '*') + '\n');
        if (!branch) {
            const remote = await git('remote', 'show', 'origin');
            branch = remote.match(/^\s*HEAD branch:\s*(.*)\s*$/m)?.[1];
            (0, node_assert_1.default)(branch, new Error('failed to detect Git repository default branch'));
        }
        await git('fetch', '--depth=1', 'origin', branch).catch(() => {
            // Fails if the branch is a commit hash.
        });
        await git('checkout', branch);
        await promises_1.default.rm(node_path_1.default.join(temporary, '.git'), { force: true, recursive: true }).catch(() => {
            // Not important.
        });
    }
    catch (error) {
        await promises_1.default.rm(temporary, { force: true, recursive: true }).catch(() => undefined);
        throw error;
    }
    return temporary;
};
exports.cloneGitRepo = cloneGitRepo;
//# sourceMappingURL=clone-git-repo.js.map