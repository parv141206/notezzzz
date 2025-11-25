import { type GitTreeFile } from "./github";
export interface TreeNode {
  name: string;
  path: string;
  type: "tree" | "blob";
  children?: TreeNode[];
}

export function buildFileTree(files: GitTreeFile[]): TreeNode[] {
  const root: TreeNode = { name: "root", path: "", type: "tree", children: [] };
  const nodes: Record<string, TreeNode> = { "": root };

  const markdownFiles = files.filter(
    (file) => file.type === "blob" && file.path.endsWith(".md"),
  );

  for (const file of markdownFiles) {
    const parts = file.path.split("/");
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part!;

      if (!nodes[currentPath]) {
        const isFile = i === parts.length - 1;
        const nodeType = isFile ? "blob" : "tree";

        nodes[currentPath] = {
          name: part!,
          path: currentPath,
          type: nodeType,
          ...(nodeType === "tree" && { children: [] }),
        };

        nodes[parentPath]!.children!.push(nodes[currentPath]!);
      }
    }
  }

  return root.children!;
}
