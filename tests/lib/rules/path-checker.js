"use strict";

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

ruleTester.run("path-checker", rule, {
    valid: [
      {
        filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\Article',
        code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
        errors: [],
      },
    ],
  
    invalid: [
      {
        filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\Article',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
        errors: [{ message: "All paths must be relative within the slice"}],
        options: [
          {
            alias: '@'
          }
        ]
      },
      {
        filename: 'C:\\Users\\slavio\\Desktop\\javascript\\production_project\\src\\entities\\Article',
        code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
        errors: [{ message: "All paths must be relative within the slice"}],
      },
    ],
  });
