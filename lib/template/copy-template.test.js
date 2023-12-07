"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const istextorbinary_1 = require("istextorbinary");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const get_files_1 = require("../filesystem/get-files");
const is_existing_path_1 = require("../filesystem/is-existing-path");
const get_input_1 = require("../io/get-input");
const copy_template_1 = require("./copy-template");
jest.mock('node:fs/promises', () => ({
    copyFile: jest.fn(),
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
}));
jest.mock('istextorbinary', () => ({
    isText: jest.fn(),
}));
jest.mock('../filesystem/get-files', () => ({
    getFiles: jest.fn(),
}));
jest.mock('../filesystem/is-existing-path', () => ({
    isExistingPath: jest.fn(),
}));
jest.mock('../io/get-input', () => ({
    getInput: jest.fn(),
}));
jest.mock('../git/create-git', () => ({
    // eslint-disable-next-line unicorn/consistent-function-scoping
    createGit: () => async (_, config) => config.includes('name') ? 'John' : 'john@email.com',
}));
describe('applyTemplate', () => {
    const files = new Map();
    const inputs = [];
    let written = [];
    let copied = [];
    let mkdirs = [];
    let errors = [];
    const onError = (error) => {
        errors.push(error);
    };
    beforeEach(() => {
        promises_1.default.readFile.mockImplementation(async (path, options) => {
            const text = files.get(path) ?? '';
            return options === 'utf-8' ? text : Buffer.from(text, 'utf-8');
        });
        promises_1.default.writeFile.mockImplementation(async (...args) => {
            written.push(args);
        });
        promises_1.default.copyFile.mockImplementation(async (...args) => {
            copied.push(args);
        });
        promises_1.default.mkdir.mockImplementation(async (...args) => {
            mkdirs.push(args);
        });
        istextorbinary_1.isText.mockReturnValue(true);
        get_files_1.getFiles.mockImplementation(async function* (root) {
            for (const file of files.keys()) {
                yield node_path_1.default.relative(root, file);
            }
        });
        is_existing_path_1.isExistingPath.mockResolvedValue(false);
        get_input_1.getInput.mockImplementation(async (message) => {
            inputs.push(message);
            return `(input-${message})`;
        });
    });
    afterEach(() => {
        files.clear();
        written = [];
        copied = [];
        mkdirs = [];
        errors = [];
    });
    test('empty directory', async () => {
        await (0, copy_template_1.copyTemplate)('from', 'to', onError);
        expect(inputs).toMatchInlineSnapshot(`Array []`);
        expect(written).toMatchInlineSnapshot(`Array []`);
        expect(copied).toMatchInlineSnapshot(`Array []`);
        expect(mkdirs).toMatchInlineSnapshot(`Array []`);
        expect(errors).toMatchInlineSnapshot(`Array []`);
    });
    test('no errors', async () => {
        files.set('from/a', 'a:{{{1}}}');
        files.set('from/b', 'b:{{{1}}}{{{2}}}');
        files.set('from/c', 'c');
        files.set('from/d/a', 'd/a:{{{3}}}');
        files.set('from/d/b', 'd/b');
        files.set('from/e', '');
        istextorbinary_1.isText.mockImplementation((path) => path !== 'from/d/a');
        is_existing_path_1.isExistingPath.mockImplementation((path) => path === 'to/e');
        await (0, copy_template_1.copyTemplate)('from', 'to', onError);
        expect(inputs).toMatchInlineSnapshot(`
      Array [
        "1",
        "2",
      ]
    `);
        expect(written.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "to/a",
          "a:(input-1)",
          Object {
            "flag": "wx",
          },
        ],
        Array [
          "to/b",
          "b:(input-1)(input-2)",
          Object {
            "flag": "wx",
          },
        ],
      ]
    `);
        expect(copied.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "from/c",
          "to/c",
          1,
        ],
        Array [
          "from/d/a",
          "to/d/a",
          1,
        ],
        Array [
          "from/d/b",
          "to/d/b",
          1,
        ],
      ]
    `);
        expect(mkdirs.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "to",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to/d",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to/d",
          Object {
            "recursive": true,
          },
        ],
      ]
    `);
        expect(errors).toMatchInlineSnapshot(`Array []`);
    });
    test('create directory error', async () => {
        files.set('from/a', '');
        files.set('from/b/a', '');
        files.set('from/b/b', '');
        const error = Object.assign(new Error('error'), { code: 'FOO', path: 'to/b' });
        promises_1.default.mkdir.mockImplementation(async (path, ...args) => {
            mkdirs.push([path, ...args]);
            if (path === 'to/b') {
                throw error;
            }
        });
        const localOnError = jest.fn();
        await (0, copy_template_1.copyTemplate)('from', 'to', localOnError);
        expect(localOnError).toHaveBeenCalledTimes(1);
        expect(localOnError).toHaveBeenLastCalledWith(error);
        expect(written.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`Array []`);
        expect(mkdirs.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "to",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to/b",
          Object {
            "recursive": true,
          },
        ],
        Array [
          "to/b",
          Object {
            "recursive": true,
          },
        ],
      ]
    `);
    });
    test('write file error', async () => {
        files.set('from/a', '{{{1}}}');
        files.set('from/b', '{{{1}}}');
        const localOnError = jest.fn();
        const error = new Error('error');
        promises_1.default.writeFile.mockImplementation(async (path, ...args) => {
            written.push([path, ...args]);
            if (path === 'to/a') {
                throw error;
            }
            else if (path === 'to/b') {
                throw Object.assign(new Error('exists'), { code: 'EEXIST' });
            }
        });
        await (0, copy_template_1.copyTemplate)('from', 'to', localOnError);
        expect(localOnError).toHaveBeenCalledTimes(1);
        expect(localOnError).toHaveBeenLastCalledWith(error);
        expect(written.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "to/a",
          "(input-1)",
          Object {
            "flag": "wx",
          },
        ],
        Array [
          "to/b",
          "(input-1)",
          Object {
            "flag": "wx",
          },
        ],
      ]
    `);
    });
    test('built-in prompts', async () => {
        new Date().getFullYear();
        files.set('from/a', '{{{&template}}} {{{&target}}} {{{&year}}} {{{&name}}} {{{&email}}}');
        await (0, copy_template_1.copyTemplate)('from.foo', 'to.bar', onError);
        expect(get_input_1.getInput).toHaveBeenCalledTimes(0);
        expect(written.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "from/a",
          "from to 2022 John john@email.com",
          Object {
            "flag": "wx",
          },
        ],
      ]
    `);
    });
    test('alternative built-in prompts', async () => {
        new Date().getFullYear();
        files.set('from/a', '~~~template.basename~~~ ~~~target.basename~~~ ~~~date.year~~~ ~~~git.user.name~~~ ~~~git.user.email~~~');
        await (0, copy_template_1.copyTemplate)('from.foo', 'to.bar', onError);
        expect(get_input_1.getInput).toHaveBeenCalledTimes(0);
        expect(written.sort((a, b) => a[0].localeCompare(b[0]))).toMatchInlineSnapshot(`
      Array [
        Array [
          "from/a",
          "from to 2022 John john@email.com",
          Object {
            "flag": "wx",
          },
        ],
      ]
    `);
    });
});
//# sourceMappingURL=copy-template.test.js.map