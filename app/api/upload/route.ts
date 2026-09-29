import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const video = formData.get("video");

    if (!(video instanceof File)) {
      return NextResponse.json(
        { error: "No video file received." },
        { status: 400 }
      );
    }

    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const extension =
      path.extname(video.name) || ".mp4";

    const safeExtension =
      extension
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");

    const fileName =
      `${crypto.randomUUID()}${safeExtension}`;

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    await writeFile(filePath, buffer);

    const videoUrl =
      `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully.",
      videoUrl,
      fileName,
      originalName: video.name,
      size: video.size,
      type: video.type,
    });

  } catch (error) {

    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Video upload failed.",
      },
      { status: 500 }
    );
  }
}