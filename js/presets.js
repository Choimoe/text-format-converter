// This file exports the conversion rule presets.
// You can add more presets here in the future.

const presets = {
    "markup-markdown-katex": {
        name: "Markup Markdown+KaTeX 插件",
        rules: [
            {
                type: 'paired',
                leftDelim: '$',
                rightDelim: '$',
                replacement: ' [latex] $1 [/latex] ',
                caseSensitive: true,
                wholeWord: false,
                multiline: false,
                isDefault: true,
            },
            {
                type: 'paired',
                leftDelim: '$$',
                rightDelim: '$$',
                replacement: ' [latex display=true] $1 [/latex] ',
                caseSensitive: true,
                wholeWord: false,
                multiline: true,
            },
            {
                type: 'direct',
                find: '_',
                replacement: '\\_',
                caseSensitive: true,
                wholeWord: false,
                multiline: false,
            },
            {
                type: 'direct',
                find: '\\\\',
                replacement: '\\newline',
                caseSensitive: true,
                wholeWord: false,
                multiline: false,
            }
        ]
    }
    // You can add another preset here like this:
    // "another-preset": {
    //     name: "Another Preset Name",
    //     rules: [ /* ... rules ... */ ]
    // }
};
