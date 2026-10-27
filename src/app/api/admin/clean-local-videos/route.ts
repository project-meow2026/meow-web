import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videosDir = path.join(process.cwd(), 'public', 'videos');
    const files = await fs.readdir(videosDir).catch(() => []);

    const deleted: string[] = [];
    const errors: any[] = [];
    for (const file of files) {
      if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov')) {
        const fullPath = path.join(videosDir, file);
        try {
          await fs.unlink(fullPath);
          deleted.push(file);
        } catch (e: any) {
          errors.push({ file, error: e.message, code: e.code });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All local video files cleaned from project repository',
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
