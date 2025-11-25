import {
  getFileContent,
  getDirectoryContents,
  type RepoContentItem,
} from "@/lib/github";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { FaRegFolder, FaRegFileLines } from "react-icons/fa6";
import remarkGfm from "remark-gfm";

interface NotePageProps {
  params: {
    slug?: string[];
  };
}

function processObsidianImages(content: string): string {
  const obsidianImageRegex = /!\[\[([^|\]]+?)\]\]/g;

  return content.replace(obsidianImageRegex, (match, imageName) => {
    const trimmedImageName = imageName.trim();
    const encodedImageName = encodeURIComponent(trimmedImageName);
    return `![](/api/image/${encodedImageName})`;
  });
}

function ensureDisplayMathNewlines(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (trimmed.startsWith("$$") && !trimmed.startsWith("$$$")) {
      if (result.length > 0 && result[result.length - 1]!.trim() !== "") {
        result.push("");
      }
      result.push(line);

      if (trimmed.endsWith("$$") && trimmed.length > 4) {
        if (i + 1 < lines.length && lines[i + 1]!.trim() !== "") {
          result.push("");
        }
      }
    } else if (trimmed.endsWith("$$") && !trimmed.startsWith("$$")) {
      result.push(line);
      if (i + 1 < lines.length && lines[i + 1]!.trim() !== "") {
        result.push("");
      }
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

function DirectoryView({
  path,
  items,
}: {
  path: string;
  items: RepoContentItem[];
}) {
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === "dir" && b.type !== "dir") return -1;
    if (a.type !== "dir" && b.type === "dir") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <ul className="space-y-1">
        {sortedItems.map((item) => (
          <li key={item.path}>
            <Link
              href={`/notes/${
                item.type === "file"
                  ? item.path.replace(/\.md$/, "")
                  : item.path
              }`}
              className="flex items-center rounded-md p-2 hover:bg-gray-800"
            >
              {item.type === "dir" ? (
                <FaRegFolder className="mr-3 h-5 w-5 flex-shrink-0 text-sky-400" />
              ) : (
                <FaRegFileLines className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
              )}
              <span className="truncate">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function NotePage({ params }: NotePageProps) {
  const path = (await params.slug?.join("/")) ?? "";
  const fileContent = path ? await getFileContent(`${path}.md`) : null;

  if (fileContent !== null) {
    let processedContent = processObsidianImages(fileContent);
    processedContent = ensureDisplayMathNewlines(processedContent);

    return (
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {processedContent}
        </ReactMarkdown>
      </article>
    );
  }

  const dirContents = await getDirectoryContents(path);

  if (dirContents) {
    return <DirectoryView path={path} items={dirContents} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">Error 404</h1>
      <p className="mt-2 text-lg">
        The page or directory at{" "}
        <code className="rounded bg-gray-700 px-1 font-mono">{path}</code> could
        not be found.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-blue-400 hover:underline"
      >
        &larr; Go back to the root
      </Link>
    </div>
  );
}
