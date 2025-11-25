"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FileTreeView } from "@/components/file-tree-view";
import { type TreeNode } from "@/lib/tree";
import { FaBars } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

interface AppShellProps {
  nodes: TreeNode[];
  children: ReactNode;
}

export function AppShell({ nodes, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <body className="flex h-screen flex-col overflow-hidden">
      <nav className="flex w-full flex-col gap-3 border-b border-gray-600 bg-gray-950 p-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white md:hidden"
            aria-label="Toggle sidebar"
          >
            <FaBars className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-2 font-bold">
            <Link href="https://github.com/parv141206/">
              <FaGithub />
            </Link>
            <Link href="/">Notezzzz</Link>
          </div>
        </div>

        <span className="hidden text-purple-300 md:block">/</span>
        <Breadcrumbs />
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-20 bg-black/60 md:hidden"
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-30 w-82 transform overflow-y-auto border-e border-gray-600 bg-gray-950 p-5 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
        >
          <FileTreeView nodes={nodes} onLinkClick={closeSidebar} />
        </aside>

        <main className="flex-1 overflow-y-auto p-6 py-20">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </body>
  );
}
