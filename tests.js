/*
Assume that hyperscript-adapter and hyperscript-adapter-modules have already been loaded.
*/

const mod = HTMLModuleCreator(HTML, {});
const fakeStylesheet = {
    foo: 'foo-hash',
    bar: 'bar-hash',
}
const SomeComponent = mod((css, use, $) => {
    css(fakeStylesheet);
    return $.div.foo($.div.bar());
});
