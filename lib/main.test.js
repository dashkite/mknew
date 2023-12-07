"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const _1 = require(".");
const clone_git_repo_1 = require("./git/clone-git-repo");
const parse_git_source_1 = require("./git/parse-git-source");
const print_usage_1 = require("./io/print-usage");
const main_1 = require("./main");
const copy_template_1 = require("./template/copy-template");
jest.mock('node:fs/promises', () => ({ rm: jest.fn() }));
jest.mock('./io/print-usage', () => ({ printUsage: jest.fn() }));
jest.mock('./io/print-error', () => ({ printError: jest.fn() }));
jest.mock('./io/print-warning', () => ({ printWarning: jest.fn() }));
jest.mock('./git/parse-git-source', () => ({ parseGitSource: jest.fn() }));
jest.mock('./git/clone-git-repo', () => ({ cloneGitRepo: jest.fn() }));
jest.mock('./template/copy-template', () => ({ copyTemplate: jest.fn() }));
describe('main', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockReturnValue();
        jest.spyOn(console, 'error').mockReturnValue();
        parse_git_source_1.parseGitSource.mockReturnValue(null);
    });
    test('help', async () => {
        await (0, main_1.main)(['--help']);
        expect(print_usage_1.printUsage).toHaveBeenCalledTimes(1);
        expect(print_usage_1.printUsage).toHaveBeenLastCalledWith();
    });
    test('missing template', async () => {
        await (0, main_1.main)([]);
        expect(_1.printError).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/template/) }));
    });
    test('missing target', async () => {
        await (0, main_1.main)(['template']);
        expect(_1.printError).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/target/) }));
    });
    test('local', async () => {
        await (0, main_1.main)(['template', 'target']);
        expect(clone_git_repo_1.cloneGitRepo).not.toHaveBeenCalled();
        expect(promises_1.default.rm).not.toHaveBeenCalled();
        expect(copy_template_1.copyTemplate).toHaveBeenCalledWith('template', 'target', expect.any(Function));
    });
    test('local with source and workspace', async () => {
        await (0, main_1.main)(['-s', 'foo', '-w', 'bar', 'template', 'target']);
        expect(copy_template_1.copyTemplate).toHaveBeenCalledWith('foo/template', 'bar/target', expect.any(Function));
    });
    test('repo', async () => {
        const source = { branch: 'baz', path: 'bar', url: 'foo' };
        parse_git_source_1.parseGitSource.mockReturnValueOnce(source);
        clone_git_repo_1.cloneGitRepo.mockResolvedValueOnce('temp');
        await (0, main_1.main)(['template', 'target']);
        expect(clone_git_repo_1.cloneGitRepo).toHaveBeenCalledWith(source, 'template');
        expect(promises_1.default.rm).toHaveBeenCalledWith('temp', expect.objectContaining({ force: true, recursive: true }));
        expect(copy_template_1.copyTemplate).toHaveBeenCalledWith('temp/bar/template', 'target', expect.any(Function));
    });
    test('throw', async () => {
        const error = new Error('error');
        const source = { branch: 'baz', path: 'bar', url: 'foo' };
        parse_git_source_1.parseGitSource.mockReturnValueOnce(source);
        clone_git_repo_1.cloneGitRepo.mockResolvedValueOnce('temp');
        copy_template_1.copyTemplate.mockRejectedValue(error);
        await (0, main_1.main)(['template', 'target']);
        expect(clone_git_repo_1.cloneGitRepo).toHaveBeenCalledWith(source, 'template');
        expect(copy_template_1.copyTemplate).toHaveBeenCalledWith('temp/bar/template', 'target', expect.any(Function));
        expect(_1.printError).toHaveBeenCalledWith(error);
        expect(promises_1.default.rm).toHaveBeenCalledWith('temp', expect.objectContaining({ force: true, recursive: true }));
    });
});
//# sourceMappingURL=main.test.js.map