module.exports = {
    "plugins": ["angular"],

    "parserOptions": {
        "sourceType": "module",
    },
    "rules": {
        "angular/di-order": 2,
        "angular/di-unused": 2,
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true, "mode": "strict" }],
        'no-console': 'error',
        'no-extra-semi': 'error',
        "no-unused-vars": 2,
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "multiline-block-like", "next": "*" },
            { "blankLine": "always", "prev": "*", "next": "multiline-block-like" },

            { "blankLine": "always", "prev": "multiline-expression", "next": "*" },
            { "blankLine": "always", "prev": "*", "next": "multiline-expression" },

            { "blankLine": "always", "prev": "*", "next": "expression" },
            { "blankLine": "always", "prev": "expression", "next": "*" },
            { "blankLine": "any", "prev": "expression", "next": "expression" },

            { "blankLine": "always", "prev": "*", "next": "var" },
            { "blankLine": "always", "prev": "var", "next": "*" },
            { "blankLine": "any", "prev": "var", "next": "var" },
        ],
        "space-infix-ops": ["error", { "int32Hint": true }]
    }
};
