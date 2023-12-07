"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const node_assert_1 = __importDefault(require("node:assert"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const clone_git_repo_1 = require("./git/clone-git-repo");
const parse_git_source_1 = require("./git/parse-git-source");
const print_error_1 = require("./io/print-error");
const print_usage_1 = require("./io/print-usage");
const print_warning_1 = require("./io/print-warning");
const copy_template_1 = require("./template/copy-template");
const main = async (argv = process.argv.slice(2)) => {
    const cleanupCallbacks = [];
    try {
        const options = (0, arg_1.default)({
            '--help': Boolean,
            '--source': String,
            '--version': Boolean,
            '--workspace': String,
            '-s': '--source',
            '-w': '--workspace',
        }, { argv });
        if (options['--help']) {
            (0, print_usage_1.printUsage)();
            return;
        }
        if (options['--version']) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            console.log(require('../package.json').version);
            return;
        }
        const source = options['--source'] || process.env.MKNEW_SOURCE || '.';
        const workspace = options['--workspace'] || process.env.MKNEW_WORKSPACE || '.';
        let [template, target] = options._;
        (0, node_assert_1.default)(template, new Error('missing <template> argument'));
        (0, node_assert_1.default)(target, new Error('missing <target> argument'));
        const gitSource = (0, parse_git_source_1.parseGitSource)(source);
        if (gitSource) {
            console.log(chalk_1.default.cyanBright(`Copying "${node_path_1.default.posix.join(gitSource.path ?? '', template)}" (${gitSource.url})`));
        }
        else {
            console.log(chalk_1.default.cyanBright(`Copying "${node_path_1.default.join(source, template)}"`));
        }
        const gitTemporary = gitSource && (await (0, clone_git_repo_1.cloneGitRepo)(gitSource, template));
        if (gitTemporary) {
            cleanupCallbacks.push(async () => promises_1.default.rm(gitTemporary, { force: true, recursive: true }));
        }
        template = gitTemporary
            ? node_path_1.default.join(gitTemporary, gitSource.path ?? '', template)
            : node_path_1.default.join(source, template);
        target = node_path_1.default.join(workspace, target);
        await (0, copy_template_1.copyTemplate)(template, target, (error) => (0, print_warning_1.printWarning)(error instanceof Error ? error.message : error));
        if (process.exitCode) {
            console.log(chalk_1.default.yellowBright(`Created "${target}" (with warnings)`));
        }
        else {
            console.log(chalk_1.default.greenBright(`Created "${target}"`));
        }
    }
    catch (error) {
        (0, print_error_1.printError)(error);
    }
    finally {
        for (const cleanup of cleanupCallbacks) {
            cleanup().catch(print_warning_1.printWarning);
        }
    }
};
exports.main = main;
//# sourceMappingURL=main.js.map