import { NextResponse } from "next/server";
import { db } from "../../lib/db";
async function makeSureTableExists() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS behavior_events (
      id TEXT PRIMARY KEY,
      student_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      behavior TEXT NOT NULL,
      category TEXT NOT NULL,
      behavior_count INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database connection is not configured." },
        { status: 500 }
      );
    }

    await makeSureTableExists();

    const result = await db.query(`
      SELECT
        id,
        student_id AS "studentId",
        student_name AS "studentName",
        behavior,
        category,
        behavior_count AS "behaviorCount",
        created_at AS "timestamp"
      FROM behavior_events
      ORDER BY created_at ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Could not load behavior events:", error);

    return NextResponse.json(
      { error: "Could not load behavior events." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database connection is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      id,
      studentId,
      studentName,
      behavior,
      category,
      behaviorCount,
    } = body;

    if (
      !id ||
      !studentId ||
      !studentName ||
      !behavior ||
      !category ||
      !behaviorCount
    ) {
      return NextResponse.json(
        { error: "Missing observation information." },
        { status: 400 }
      );
    }

    await makeSureTableExists();

    const result = await db.query(
      `
        INSERT INTO behavior_events (
          id,
          student_id,
          student_name,
          behavior,
          category,
          behavior_count
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          student_id AS "studentId",
          student_name AS "studentName",
          behavior,
          category,
          behavior_count AS "behaviorCount",
          created_at AS "timestamp"
      `,
      [
        id,
        studentId,
        studentName,
        behavior,
        category,
        behaviorCount,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Could not save behavior event:", error);

    return NextResponse.json(
      { error: "Could not save behavior event." },
      { status: 500 }
    );
  }
}