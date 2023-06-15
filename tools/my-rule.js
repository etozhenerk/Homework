"use strict";

module.exports = {
    meta: {
        fixable: "code",
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const groups = [/^@\w/, /^\w/, /^\.\.\//, /^\./];

        const range = {
            start: (node) => node.range[0],
            end: (node) => node.range[1],
        };

        const getSortValue = (node) => getName(node.source);

        const getTextRange = (left, right) => [range.start(left), range.end(right)];

        function getNodeRange(source, node, includeComments = true) {
            return getTextRange((includeComments && source.getCommentsBefore(node)[0]) || node, node);
        }

        function getNodeText(source, node, includeComments = true) {
            return source.getText().slice(...getNodeRange(source, node, includeComments));
        }

        function getName(node) {
            switch (node.type) {
                case "Identifier":
                case "PrivateIdentifier":
                    return node.name;

                case "Literal":
                    return node.value.toString();

                case "TemplateLiteral":
                    return node.quasis.reduce(
                        (acc, quasi, i) => acc + quasi.value.raw + getName(node.expressions[i]),
                        "",
                    );
            }

            return "";
        }

        const filterNodes = (nodes, types) => nodes.filter((node) => types.includes(node.type));

        function getSortGroup(sortGroups, node) {
            const source = getName(node.source);

            for (let i = 0; i < sortGroups.length; i++) {
                const group = sortGroups[i];

                if (group && new RegExp(group).test(source)) {
                    return i;
                }
            }

            return 0;
        }

        return {
            Program: (node) => {
                const programText = getNodeText(sourceCode, node);
                const nodes = filterNodes(node.body, ["ImportDeclaration"]);
                const dinamicNodes = filterNodes(node.body, ["VariableDeclaration"]);
                const sorted = nodes
                    .slice()
                    .sort(
                        (a, b) =>
                            getSortGroup(groups, a) - getSortGroup(groups, b) ||
                            getSortValue(a).localeCompare(getSortValue(b)),
                    );

                const firstNode = sourceCode.getCommentsBefore(nodes[0])[0] || nodes[0];
                const lastNode = nodes[nodes.length - 1];

                const range = getTextRange(firstNode, lastNode);

                let text = "";

                let group = null;

                sorted.forEach((node, i) => {
                    const currentGroup = getSortGroup(groups, node);
                    const currentText = getNodeText(sourceCode, node);

                    if (group !== null && currentGroup !== group) {
                        text += "\n";
                    }

                    text += currentText;

                    if (i !== sorted.length - 1) {
                        text += "\n";
                    }
                    group = currentGroup;
                });

                if (dinamicNodes.length > 0) {
                    text += "\n\n";
                    dinamicNodes.forEach((node, i) => {
                        const currentText = getNodeText(sourceCode, node);

                        text += currentText;

                        if (i !== dinamicNodes.length - 1) {
                            text += "\n";
                        }
                    });
                }

                if (!programText.includes(text)) {
                    context.report({
                        node: node,
                        message: "unsorted",
                        fix(fixer) {
                            return fixer.replaceTextRange(range, text);
                        },
                    });
                }
            },
        };
    },
};
