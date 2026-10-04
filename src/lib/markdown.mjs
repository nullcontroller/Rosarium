import { visit } from "unist-util-visit";
export const labels = {
  principle: "設計原則",
  decision: "設計判断",
  risk: "リスク",
  responsibility: "責任境界",
  evidence: "根拠",
  case: "実務事例",
  note: "補足",
};
export function semanticDirectives() {
  return (tree, file) => {
    visit(tree, (node) => {
      if (
        !["containerDirective", "leafDirective", "textDirective"].includes(
          node.type,
        )
      )
        return;
      if (node.type !== "containerDirective") {
        node.type = "text";
        node.value = String(file.value).slice(
          node.position.start.offset,
          node.position.end.offset,
        );
        delete node.children;
        return;
      }
      if (!Object.hasOwn(labels, node.name))
        file.fail("Unsupported directive: " + node.name, node);
      node.data = {
        ...node.data,
        hName: "adf-directive",
        hProperties: {
          "data-kind": node.name,
          "data-title": node.attributes?.title || labels[node.name],
        },
      };
    });
  };
}
export function localUrls() {
  return (tree) => {
    visit(tree, "element", (node) => {
      for (const key of ["href", "src"]) {
        const v = node.properties?.[key];
        if (
          typeof v === "string" &&
          v.startsWith("/") &&
          !v.startsWith("//") &&
          !v.startsWith("/Rosarium/")
        )
          node.properties[key] = "/Rosarium" + v;
      }
    });
  };
}
