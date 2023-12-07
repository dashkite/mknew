"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const get_git_ignored_1 = require("../git/get-git-ignored");
const get_files_1 = require("./get-files");
jest.mock('node:fs/promises', () => ({ readdir: jest.fn(), stat: jest.fn() }));
jest.mock('../git/get-git-ignored', () => ({ getGitIgnored: jest.fn() }));
const toArrayFromAsyncGen = async (generator) => {
    const values = [];
    for await (const value of generator) {
        values.push(value);
    }
    return values;
};
describe('getFilenames', () => {
    const statMock = promises_1.default.stat;
    const readdirMock = promises_1.default.readdir;
    const getIgnoredMock = get_git_ignored_1.getGitIgnored;
    beforeEach(() => {
        statMock.mockResolvedValue({ isDirectory: () => true });
        readdirMock.mockResolvedValue([]);
        getIgnoredMock.mockResolvedValue([]);
    });
    test('files only', async () => {
        readdirMock.mockResolvedValueOnce([
            { isDirectory: () => false, name: 'a' },
            { isDirectory: () => false, name: 'b' },
            { isDirectory: () => false, name: 'c' },
        ]);
        expect(await toArrayFromAsyncGen((0, get_files_1.getFiles)('root'))).toMatchInlineSnapshot(`
Array [
  "a",
  "b",
  "c",
]
`);
    });
    test('files first', async () => {
        readdirMock
            .mockResolvedValueOnce([
            { isDirectory: () => false, name: 'a' },
            { isDirectory: () => true, name: 'b' },
            { isDirectory: () => false, name: 'c' },
        ])
            .mockResolvedValueOnce([{ isDirectory: () => false, name: 'd' }]);
        expect(await toArrayFromAsyncGen((0, get_files_1.getFiles)('root'))).toMatchInlineSnapshot(`
Array [
  "a",
  "c",
  "b/d",
]
`);
    });
    test('nested', async () => {
        readdirMock
            .mockResolvedValueOnce([
            { isDirectory: () => false, name: 'a' },
            { isDirectory: () => true, name: 'b' },
            { isDirectory: () => true, name: 'c' },
        ])
            .mockResolvedValueOnce([
            { isDirectory: () => true, name: 'd' },
            { isDirectory: () => false, name: 'e' },
        ])
            .mockResolvedValueOnce([{ isDirectory: () => false, name: 'f' }])
            .mockResolvedValueOnce([{ isDirectory: () => false, name: 'g' }]);
        expect(await toArrayFromAsyncGen((0, get_files_1.getFiles)('root'))).toMatchInlineSnapshot(`
Array [
  "a",
  "b/e",
  "b/d/f",
  "c/g",
]
`);
    });
    test('file', async () => {
        statMock.mockResolvedValue({ isDirectory: () => false });
        expect(await toArrayFromAsyncGen((0, get_files_1.getFiles)('root'))).toMatchInlineSnapshot(`
Array [
  ".",
]
`);
    });
});
//# sourceMappingURL=get-files.test.js.map