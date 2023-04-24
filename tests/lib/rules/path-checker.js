"use strict";

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

const aliasOptions = [
    {
        alias: '@'
    }
];

ruleTester.run("public-api-imports", rule, {
    valid: [
        {
            code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
            errors: [],
        },
        {
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
            errors: [],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
            }],
        },
        {
            filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
            errors: [],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
            }],
        }
    ],

    invalid: [
        {
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
            errors: [{ message: "Absolute import is allowed from Public API file only (index.ts)" }],
            options: aliasOptions,
        },
        {
            filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
            errors: [{ message: "Absolute import is allowed from Public API file only (index.ts)" }],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
            }],
        },
        {
            filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts',
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
            errors: [{ message: "Absolute import is allowed from Public API file only (index.ts)" }],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
            }],
        }
    ],
});
