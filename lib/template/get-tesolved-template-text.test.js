"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_resolved_template_text_1 = require("./get-resolved-template-text");
describe('getResolvedTemplateText', () => {
    test('at start', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('{{{foo}}} bar', async () => 'a')).toMatchInlineSnapshot(`"a bar"`);
    });
    test('at end', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('bar {{{foo}}}', async () => 'a')).toMatchInlineSnapshot(`"bar a"`);
    });
    test('in middle', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('bar {{{foo}}} baz', async () => 'a')).toMatchInlineSnapshot(`"bar a baz"`);
    });
    test('all', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('a{{{b}}}{{{c}}}de{{{f}}}g', async (id) => `(${id.toUpperCase()})`)).toMatchInlineSnapshot(`"a(B)(C)de(F)g"`);
    });
    test('not newline', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)(`a{{{b
}}}{{{c}}}d`, async (id) => id.toUpperCase())).toMatchInlineSnapshot(`
"a{{{b
}}}Cd"
`);
    });
    test('not empty', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('a{{{}}}{{{b}}}c', async (id) => id.toUpperCase())).toMatchInlineSnapshot(`"a{{{}}}Bc"`);
    });
    test('tildes', async () => {
        expect(await (0, get_resolved_template_text_1.getResolvedTemplateText)('@foo/~~~.bar~~~.baz', async (id) => id.toUpperCase())).toMatchInlineSnapshot(`"@foo/.BAR.baz"`);
    });
});
//# sourceMappingURL=get-tesolved-template-text.test.js.map