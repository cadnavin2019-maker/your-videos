import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ["video/*"],
          maximumSizeInBytes: 5 * 1024 * 1024 * 1024,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("VIDEO UPLOAD COMPLETED:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("BLOB CLIENT UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Upload authorization failed.",
      },
      { status: 500 }
    );
  }
}