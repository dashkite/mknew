"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyTemplate = void 0;
const istextorbinary_1 = require("istextorbinary");
const node_fs_1 = require("node:fs");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const get_files_1 = require("../filesystem/get-files");
const is_existing_path_1 = require("../filesystem/is-existing-path");
const create_git_1 = require("../git/create-git");
const get_input_1 = require("../io/get-input");
const is_system_error_1 = require("../utilities/is-system-error");
const run_tasks_1 = require("../utilities/run-tasks");
const get_prompt_key_1 = require("./get-prompt-key");
const get_resolved_template_text_1 = require("./get-resolved-template-text");
const get_template_placeholders_1 = require("./get-template-placeholders");
/**
 * Copy all files from a template to the target.
 */
const copyTemplate = async (template, target, onError = () => undefined) => {
    const prompts = [];
    const values = new Map();
    const errorPaths = new Set();
    const readTasks = [];
    const writeTasks = [];
    const read = async (path) => {
        const destinationFilename = node_path_1.default.join(target, path);
        const filePrompts = [];
        prompts.push(filePrompts);
        if (await (0, is_existing_path_1.isExistingPath)(destinationFilename)) {
            return;
        }
        const templateFilename = node_path_1.default.join(template, path);
        const buffer = await promises_1.default.readFile(templateFilename);
        let isTemplate = false;
        if ((0, istextorbinary_1.isText)(templateFilename, buffer)) {
            for (const { prompt } of (0, get_template_placeholders_1.getTemplatePlaceholders)(buffer.toString('utf-8'))) {
                isTemplate = true;
                filePrompts.push(prompt);
            }
        }
        const copy = isTemplate ? copyText : copyData;
        writeTasks.push(async () => copy(templateFilename, destinationFilename));
    };
    const resolve = async (prompt) => {
        const { key, isBuiltIn } = (0, get_prompt_key_1.getPromptKey)(prompt);
        if (values.has(key)) {
            return;
        }
        if (isBuiltIn) {
            switch (key) {
                case 'template.basename':
                    values.set(key, node_path_1.default.parse(node_path_1.default.resolve(template)).name);
                    break;
                case 'target.basename':
                    values.set(key, node_path_1.default.parse(node_path_1.default.resolve(target)).name);
                    break;
                case 'date.year':
                    values.set(key, `${new Date().getFullYear()}`);
                    break;
                case 'git.user.name':
                    values.set(key, await (0, create_git_1.createGit)(process.cwd())('config', 'user.name').catch(() => {
                        throw new Error('git user name not found');
                    }));
                    break;
                case 'git.user.email':
                    values.set(key, await (0, create_git_1.createGit)(process.cwd())('config', 'user.email').catch(() => {
                        throw new Error('git user email not found');
                    }));
                    break;
            }
            return;
        }
        values.set(key, await (0, get_input_1.getInput)(prompt));
    };
    const copyData = async (from, to) => {
        await promises_1.default.mkdir(node_path_1.default.dirname(to), { recursive: true });
        await promises_1.default.copyFile(from, to, node_fs_1.constants.COPYFILE_EXCL);
    };
    const copyText = async (from, to) => {
        const inText = await promises_1.default.readFile(from, 'utf-8');
        const outText = await (0, get_resolved_template_text_1.getResolvedTemplateText)(inText, async (prompt) => values.get((0, get_prompt_key_1.getPromptKey)(prompt).key) ?? '');
        await promises_1.default.mkdir(node_path_1.default.dirname(to), { recursive: true });
        await promises_1.default.writeFile(to, outText, { flag: 'wx' });
    };
    for await (const file of (0, get_files_1.getFiles)(template)) {
        readTasks.push(async () => read(file));
    }
    await (0, run_tasks_1.runTasks)(readTasks);
    for (const prompt of [].concat(...prompts)) {
        await resolve(prompt);
    }
    await (0, run_tasks_1.runTasks)(writeTasks, {
        onError: async (error) => {
            if ((0, is_system_error_1.isSystemError)(error)) {
                if (error.code === 'EEXIST') {
                    // Ignore the error, because if a file already exists then it should be silently skipped.
                    return;
                }
                if (error.path) {
                    if (errorPaths.has(error.path)) {
                        // Ignore the error, because an error has already been thrown for the path.
                        return;
                    }
                    errorPaths.add(error.path);
                }
            }
            onError(error);
        },
    });
};
exports.copyTemplate = copyTemplate;
//# sourceMappingURL=copy-template.js.map