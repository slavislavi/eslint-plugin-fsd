"use strict";

const rule = require("../../../lib/rules/public-api-imports"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

ruleTester.run("public-api-imports", rule, {
    valid: [
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "",
            errors: [{ message: "Fill me in.", type: "Me too" }],
        },
    ],
});
