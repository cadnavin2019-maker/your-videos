import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const sql = neon(databaseUrl);

// SAVE VIDEO
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      category,
      video_url,
      pathname,
    } = body;

    if (!title || !category || !video_url) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, category and video URL are required.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO videos (
        title,
        description,
        category,
        video_url,
        pathname
      )
      VALUES (
        ${title},
        ${description || ""},
        ${category},
        ${video_url},
        ${pathname || ""}
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      video: result[0],
    });
  } catch (error) {
    console.error("DATABASE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save video.",
      },
      { status: 500 }
    );
  }
}

// GET ALL VIDEOS
export async function GET() {
  try {
    const videos = await sql`
      SELECT
        id,
        title,
        description,
        category,
        video_url,
        pathname,
        created_at
      FROM videos
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("DATABASE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load videos.",
      },
      { status: 500 }
    );
  }
}