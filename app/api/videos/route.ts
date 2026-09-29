import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

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
          error:
            "Title, category and video URL are required.",
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
    console.error("DATABASE ERROR:", error);

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