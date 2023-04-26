const { isPathRelative } = require('../helpers');
const micromatch = require("micromatch");
const path = require("path");

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "not allowed to import from module directly",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: "code", // Or `code` or `whitespace`
        messages: {
            [PUBLIC_ERROR]: "Absolute import is allowed from Public API file only (index.ts)",
            [TESTING_PUBLIC_ERROR]: "Test data is needed to import from publicApi/testing.ts",
        },
        schema: [ // Add a schema if the rule has options
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string'
                    },
                    testFilesPatterns: {
                        type: 'array'
                    }
                }
            }
        ],
    },

    create(context) {
        const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

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
                const layer = segments[0];
                const slice = segments[1];

                if (!allowedLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = segments.length > 2;
                const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report({
                        node,
                        messageId: PUBLIC_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
                        }
                    })
                }

                if (isTestingPublicApi) {
                    const currentFilePath = context.getFilename();
                    const normalizedPath = path.toNamespacedPath(currentFilePath);

                    const isCurrentFileTesting = testFilesPatterns.some(
                        pattern => micromatch.isMatch(normalizedPath, pattern)
                    )

                    if (!isCurrentFileTesting) {
                        context.report({
                            node,
                            messageId: TESTING_PUBLIC_ERROR
                        })
                    }
                }
            }
        };
    },
};
