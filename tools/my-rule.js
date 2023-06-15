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
      return getTextRange(
        (includeComments && source.getCommentsBefore(node)[0]) || node,
        node
      );
    }

    function getNodeText(source, node, includeComments = true) {
      return source
        .getText()
        .slice(...getNodeRange(source, node, includeComments));
    }

    function isUnsorted(nodes, sorted) {
      return nodes.find((node, i) => node !== sorted[i]);
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
            (acc, quasi, i) =>
              acc + quasi.value.raw + getName(node.expressions[i]),
            ""
          );
      }

      return "";
    }

    const filterNodes = (nodes, types) =>
      nodes.filter((node) => types.includes(node.type));

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
        const nodes = filterNodes(node.body, ["ImportDeclaration"]);
        const sorted = nodes
          .slice()
          .sort(
            (a, b) =>
              getSortGroup(groups, a) - getSortGroup(groups, b) ||
              getSortValue(a).localeCompare(getSortValue(b))
          );

        const firstUnsortedNode = isUnsorted(nodes, sorted);

        if (firstUnsortedNode) {
          const firstNode = nodes[0];
          const lastNode = nodes[nodes.length - 1];

          const range = getTextRange(firstNode, lastNode);

          let text = "";

          let group = null;

          sorted.forEach((node) => {
            const currentGroup = getSortGroup(groups, node);
            const currentText = getNodeText(sourceCode, node);

            if (group !== null && currentGroup !== group) {
              text += "\n";
            }

            text += currentText + "\n";
            group = currentGroup;
          });

          context.report({
            node: firstUnsortedNode,
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
