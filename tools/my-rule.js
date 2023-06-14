"use strict";

module.exports = {
  meta: {
    fixable: "code",
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const text = sourceCode.text;
    let nodes = [];

    function isRelativeImport(path) {
      return path.startsWith("./") || path.startsWith("../");
    }

    function isScopedOrAliasedImport(path) {
      return path.startsWith("@");
    }

    function isNpmPackageImport(path) {
      return !isRelativeImport(path) && !isScopedOrAliasedImport(path);
    }

    function sortNodes(a, b) {
      return a.specifiers[0].local.name.localeCompare(
        b.specifiers[0].local.name
      );
    }

    return {
      ImportDeclaration: (node) => {},
      Program: (node) => {
        const allImports = node.body.filter(
          (el) => el.type === "ImportDeclaration"
        );

        const relativeImports = node.body
          .filter(
            (el) =>
              el.type === "ImportDeclaration" &&
              isRelativeImport(el.source.value)
          )
          .sort(sortNodes);

        const scopedOrAliasedImports = node.body
          .filter(
            (el) =>
              el.type === "ImportDeclaration" &&
              isScopedOrAliasedImport(el.source.value)
          )
          .sort(sortNodes);

        const npmPackageImports = node.body
          .filter(
            (el) =>
              el.type === "ImportDeclaration" &&
              isNpmPackageImport(el.source.value)
          )
          .sort(sortNodes);

        const allSortedImports = [
          ...relativeImports,
          ...scopedOrAliasedImports,
          ...npmPackageImports,
        ];

        const allImportsNames = allImports.map(
          (el) => el.specifiers[0].local.name
        );

        const allSortedImportsNames = allSortedImports.map(
          (el) => el.specifiers[0].local.name
        );

        if (allImportsNames.join(" ") !== allSortedImportsNames.join(" ")) {
          context.report({
            node,
            message: "test",
          });
        }
      },
    };
  },
};
