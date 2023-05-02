"use strict";

const path = require('path');
const { isPathRelative } = require('../helpers');

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature sliced relative path checker",
            category: "Fill me in",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: 'code', // Or `code` or `whitespace`
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
                    context.report({
                        node: node,
                        message: "All paths must be relative within the slice",
                        fix: (fixer) => {
                            const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
                                .split('/')
                                .slice(0, -1)
                                .join('/');
                            let relativePath = path.relative(normalizedPath, `/${importTo}`)
                                .split('\\')
                                .join('/');
                            
                            if (!relativePath.startsWith('.')) {
                                relativePath = `./${relativePath}`;
                            }
                            return fixer.replaceText(node.source, `'${relativePath}'`);
                        }
                    })
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

function getNormalizedCurrentFilePath(currentPath) {
    const normalizedPath = path
        .toNamespacedPath(currentPath)
        .replace(/\\/g, '/');
    const projectFrom = normalizedPath.split('src')[1];
    return projectFrom;
}

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

    const projectFrom = getNormalizedCurrentFilePath(from);
    const fromArray = projectFrom.split('/'); // [ '', 'entities', 'Article' ]
    const fromLayer = fromArray[1]; // entities
    const fromSlice = fromArray[2]; // Article

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && toLayer === fromLayer;
}