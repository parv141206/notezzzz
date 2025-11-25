"use client";

import { useState } from "react";
import Link from "next/link";
import { type TreeNode } from "@/lib/tree";

import { FaChevronRight, FaChevronDown } from "react-icons/fa6";

function TreeNodeComponent({
  node,
  onLinkClick,
}: {
  node: TreeNode;
  onLinkClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = node.type === "tree";

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mt-1">
      <div
        onClick={handleToggle}
        className="flex cursor-pointer items-center rounded-md px-1 py-0.5"
      >
        {isFolder ? (
          <span className="flex w-5 items-center justify-center text-gray-500">
            {isOpen ? (
              <FaChevronDown size="0.75em" />
            ) : (
              <FaChevronRight size="0.75em  " />
            )}
          </span>
        ) : (
          <span className="w-1"></span>
        )}

        {isFolder ? (
          <span className="font-semibold">{node.name}</span>
        ) : (
          <Link
            href={`/notes/${node.path.replace(".md", "")}`}
            className="text-purple-300 hover:underline"
            onClick={onLinkClick}
          >
            {node.name.replace(".md", "")}
          </Link>
        )}
      </div>

      {isFolder && isOpen && (
        <div className="ml-[10px] border-l border-dashed border-gray-600 pl-4">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeView({
  nodes,
  onLinkClick,
}: {
  nodes: TreeNode[];
  onLinkClick: () => void;
}) {
  return (
    <nav>
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.path}
          node={node}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  );
}
