import { env } from "@/env";
import { unstable_noStore as noStore } from "next/cache";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = env.GITHUB_USERNAME;
const GITHUB_REPO_NAME = env.GITHUB_REPO_NAME;

const authHeaders = {
  headers: {
    Authorization: `token ${env.GITHUB_PAT}`,
  },
};

export interface GitTreeFile {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitTreeResponse {
  tree: GitTreeFile[];
}

export async function getFileTree(): Promise<GitTreeFile[]> {
  noStore();

  const url = `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/git/trees/main?recursive=1`;

  try {
    const response = await fetch(url, authHeaders);
    if (!response.ok) {
      throw new Error(`Error fetching file tree: ${response.statusText}`);
    }
    const data = (await response.json()) as GitTreeResponse;
    return data.tree.filter(
      (file) => file.type === "blob" && file.path.endsWith(".md"),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export interface RepoContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
}

interface GitHubFileContent {
  content: string;
  encoding: string;
  name: string;
  path: string;
  type: string;
}

interface GitHubDirectoryItem {
  name: string;
  path: string;
  type: string;
}

export async function getFileContent(filePath: string): Promise<string | null> {
  noStore();
  const url = `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/contents/${filePath}`;

  try {
    const response = await fetch(url, authHeaders);
    if (!response.ok) return null;

    const data = (await response.json()) as
      | GitHubFileContent
      | GitHubDirectoryItem[];

    if (Array.isArray(data)) {
      return null;
    }

    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getDirectoryContents(
  dirPath: string,
): Promise<RepoContentItem[] | null> {
  noStore();
  const url = `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/contents/${dirPath}`;

  try {
    const response = await fetch(url, authHeaders);
    if (!response.ok) return null;

    const data = (await response.json()) as
      | GitHubDirectoryItem[]
      | GitHubFileContent;
    if (!Array.isArray(data)) return null;
    return data.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type === "dir" ? "dir" : "file",
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}
