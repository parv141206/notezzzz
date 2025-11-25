import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

async function getRawImageFromGithub(
  imagePath: string,
): Promise<ArrayBuffer | null> {
  const GITHUB_API_URL = "https://api.github.com";
  const GITHUB_USERNAME = env.GITHUB_USERNAME;
  const GITHUB_REPO_NAME = env.GITHUB_REPO_NAME;

  const url = `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/contents/${imagePath}`;

  try {
    const metaResponse = await fetch(url, {
      headers: {
        Authorization: `token ${env.GITHUB_PAT}`,
      },
    });

    if (!metaResponse.ok) return null;

    const metaData = await metaResponse.json();
    if (!metaData.download_url) return null;

    const imageResponse = await fetch(metaData.download_url, {
      headers: {
        Authorization: `token ${env.GITHUB_PAT}`,
      },
    });

    if (!imageResponse.ok) return null;

    return await imageResponse.arrayBuffer();
  } catch (error) {
    console.error("Error fetching image from GitHub:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const imagePath = params.slug.join("/");

  const imageBuffer = await getRawImageFromGithub(imagePath);

  if (!imageBuffer) {
    return new NextResponse("Image not found", { status: 404 });
  }

  let contentType = "application/octet-stream";
  if (imagePath.endsWith(".png")) contentType = "image/png";
  if (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg"))
    contentType = "image/jpeg";
  if (imagePath.endsWith(".gif")) contentType = "image/gif";
  if (imagePath.endsWith(".svg")) contentType = "image/svg+xml";

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
