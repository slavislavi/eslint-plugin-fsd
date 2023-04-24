"use strict";

const { isPathRelative } = '../helpers';

module.exports = {
    // eslint-disable-next-line eslint-plugin/prefer-message-ids
    meta: {
        // eslint-disable-next-line eslint-plugin/require-meta-type
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "not allowed to import from module directly",
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

        const allowedLayers = {
            'entities': 'entities',
            'features': 'features',
            'pages': 'pages',
            'widgets': 'widgets'
        };

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                if (isPathRelative(importTo)) {
                    return;
                }

                // [entities, Article, model, types] 
                const segments = importTo.split('/');
                const isImportNotFromPublicApi = segments.length > 2;
                const layer = segments[0];

                if (!allowedLayers[layer]) {
                    return;
                }

                if (isImportNotFromPublicApi) {
                    context.report({ node: node, message: "Absolute import is allowed from Public API file only (index.ts)" })
                }
            }
        };
    },
};
