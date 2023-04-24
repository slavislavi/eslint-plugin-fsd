/**
 * @fileoverview feature sliced relative path checker
 * @author Slavio
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

ruleTester.run("path-checker", rule, {
    valid: [
        {
            filename: "C:\\Users\\User\\Desktop\\my-project\\src\\entities\\Article",
            code: "import { ArticleListItem } from '../../ui/ArticleListItem/ArticleListItem'",
            errors: [],
        },
    ],

    invalid: [
        {
            filename: "C:\\Users\\User\\Desktop\\my-project\\src\\entities\\Article",
            code: "import { ArticleListItem } from '@/entities/Article/ui/ArticleListItem/ArticleListItem'",
            errors: [{ message: "All paths must be relative within the slice" }],
            options: [
                {
                    alias: '@'
                }
            ]
        },
        {
            filename: "C:\\Users\\User\\Desktop\\my-project\\src\\entities\\Article",
            code: "import { ArticleListItem } from 'entities/Article/ui/ArticleListItem/ArticleListItem'",
            errors: [{ message: "All paths must be relative within the slice" }],
        },
    ],
});
