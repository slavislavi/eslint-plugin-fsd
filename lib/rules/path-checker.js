"use strict";

const path = require('path');
const { isPathRelative } = '../helpers';

module.exports = {
    // eslint-disable-next-line eslint-plugin/prefer-message-ids
    meta: {
        // eslint-disable-next-line eslint-plugin/require-meta-type
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature sliced relative path checker",
            category: "Fill me in",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [ // Add a schema if the rule has options
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string'
                    }
                }
            }
        ],
    },

    create(context) {
        const alias = context.options[0]?.alias || '';
        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                // example: entities/Article
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                // example: C:\Users\User\Desktop\my-project\src\entities\Article\index.tsx
                const fromFilename = context.getFilename();

                if (shouldBeRelative(fromFilename, importTo)) {
                    context.report({ node: node, message: "All paths must be relative within the slice" })
                }
            }
        };
    },
};

const layers = {
    'entities': 'entities',
    'features': 'features',
    'shared': 'shared',
    'pages': 'pages',
    'widgets': 'widgets'
};

function shouldBeRelative(from, to) {
    if (isPathRelative(to)) {
        return false;
    }

    // example: entities/Article
    const toArray = to.split('/');
    const toLayer = toArray[0]; // entities
    const toSlice = toArray[1]; // Article

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }

    const normalizedPath = path.toNamespacedPath(from);
    const isWindowsOS = normalizedPath.includes('\\');
    const fromPath = normalizedPath.split('src')[1];
    const fromArray = fromPath.split(isWindowsOS ? '\\' : '/'); // [ '', 'entities', 'Article' ]
    const fromLayer = fromArray[1]; // entities
    const fromSlice = fromArray[2]; // Article

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && toLayer === fromLayer;
}