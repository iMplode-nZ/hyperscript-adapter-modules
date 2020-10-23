/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
/* global define */

(function (root, factory) {
    const f = () => factory;
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('hyperscript-adapter-modules', f);

        try {
            define(f);
        } catch (e) {}
    } else if (
        typeof exports === 'object' &&
        typeof exports.nodeName !== 'string'
    ) {
        // CommonJS
        if (typeof module === 'object' && typeof module.exports === 'object')
            exports = module.exports = factory;
    } else {
        // Browser globals
        root.HTMLModuleCreator = factory;
    }
})(typeof self !== 'undefined' ? self : this, (HTML, settings = {}) => {
    function withDefaults(obj, def) {
        return new Proxy(obj, {
            get(_, prop) {
                const val = obj[prop];
                const defval = def[prop];
                if (val === undefined) {
                    return defval;
                } else if (typeof val === 'object') {
                    return withDefaults(val, defval);
                } else {
                    return val;
                }
            },
        });
    }
    const s = withDefaults(settings, {
        fallbackClasses: false,
        partialBind: false,
    });

    const globalComponents = Object.create(null);
    function mod(name, f) {
        // Components is object as it will be public.
        const components = Object.create(mod.globalComponents);
        // Same for this.
        const cssClassNames = Object.create(null);
        const css = (a) =>
            Object.entries(a).forEach(([x, y]) => (cssClassNames[x] = y));
        const use = (c) => (components[c.name] = c.component);
        css.classes = cssClassNames;
        const $ = HTML({
            resolvers: {
                classResolver: (_cl, toKebabCase, opt) => {
                    const cl = opt.hyphenate.classes ? toKebabCase(_cl) : _cl;
                    const m = cssClassNames[cl];
                    if (m === undefined) {
                        if (s.fallbackClasses) {
                            return cl;
                        } else {
                            throw new Error(`Cannot find class name ${cl}.`);
                        }
                    }
                    return m;
                },
                tagResolver: (_tag, toKebabCase, opt) => {
                    const tag = opt.hyphenate.tag ? toKebabCase(_tag) : _tag;
                    return components[tag] || tag;
                },
            },
        });
        const c = s.partialBind
            ? (...args) => f(css, use, $, ...args)
            : f(css, use, $);
        return { name, component: c };
    }
    mod.globalComponents = globalComponents;
    mod.addGlobal = (c) => {
        globalComponents[c.name] = c.component;
    };
    return mod;
});

/*
Usage:
```
const style = require('./style.css');
const other = require('./other.js');

module.exports = mod('This', (css, use, $) => {
    css(style); // or use(style);
    use(other);
    $.other.styledClass(...);
});
```
*/
