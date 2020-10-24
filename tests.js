/* global HTMLModuleCreator, HTML */

/*
Assume that hyperscript-adapter and hyperscript-adapter-modules have already been loaded.
*/

// Assert two structures are equal.
function deepEq(a, b) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
        throw new Error(
            'Invalid Assertion: ' +
                JSON.stringify(a, undefined, 4) +
                ' is not equal to ' +
                JSON.stringify(b, undefined, 4)
        );
    }
}

const HTML2 = HTML({
    h: (...args) => [...args],
    fixArrays: false,
});
const mod = HTMLModuleCreator(HTML2);
const stylesheet = {
    foo: 'foo-hash',
    bar: 'bar-hash',
};
const SomeComponent = mod('SomeComponent', (css, use, $) => {
    css(stylesheet);
    return $.div.foo($.div.bar());
});
const OtherComponent = mod('OtherComponent', (css, use, $) => {
    use(SomeComponent);
    return $.SomeComponent();
});
deepEq(OtherComponent, {
    name: 'OtherComponent',
    component: [
        ['div', { className: 'foo-hash' }, ['div', { className: 'bar-hash' }]],
        {},
    ],
}); // No need to eq SomeComponent.
try {
    mod('___', (css, use, $) => {
        return $.div.foo();
    });
    throw new Error('Test failed.');
} catch (e) {
    if (e.message !== 'Cannot find class name foo.')
        throw new Error('Test failing test failed.');
}
const mod2 = HTMLModuleCreator(HTML2, {
    fallbackClasses: true,
    partialApply: true,
    hyphenatedComponents: true,
});
const ComponentA = mod2('component-a', (css, use, $) => {
    css(stylesheet);
    return $.div.notInStylesheet();
});
// Component A is a function.
if (!(typeof ComponentA.component === 'function'))
    throw new Error('Invalid Component');
const ComponentB = mod2('component-b', (css, use, $) => {
    use(ComponentA);
    return $.ComponentA();
});
if (!(typeof ComponentB.component()[1] === 'object'))
    throw new Error('Invalid Component');
mod.addGlobal(SomeComponent);
deepEq(
    mod('OtherComponent', (_, __, $) => $.SomeComponent()),
    OtherComponent
);
