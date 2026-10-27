import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bannerDir = path.join(process.cwd(), 'public', 'images', 'banners');
    await fs.mkdir(bannerDir, { recursive: true });

    const artifactsDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b76fff1c-4ba0-4c3c-ba82-492f8ce0a43e';
    const filesToCopy = [
      {
        src: path.join(artifactsDir, 'mid_banner_sandals_1793091267818.jpg'),
        dest: path.join(bannerDir, 'mid-banner.jpg'),
      },
      {
        src: path.join(artifactsDir, 'brand_story_feet_1793091288762.jpg'),
        dest: path.join(bannerDir, 'story-banner.jpg'),
      },
      {
        src: path.join(artifactsDir, '.user_uploaded', 'media_1793094418715.png'),
        dest: path.join(bannerDir, 'bottom-cta-glass-bg.png'),
      },
      {
        src: path.join(artifactsDir, '.user_uploaded', 'media_1793094418715.png'),
        dest: path.join(bannerDir, 'bottom-cta-bg.jpg'),
      },
    ];

    const copied: any[] = [];
    for (const f of filesToCopy) {
      try {
        await fs.copyFile(f.src, f.dest);
        const buf = await fs.readFile(f.dest);
        let dims = null;
        if (f.dest.endsWith('.png')) {
          dims = { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
        }
        copied.push({ name: path.basename(f.dest), dims });
      } catch (e: any) {
        console.error('Error copying file:', f.src, e.message);
      }
    }

    const checkFiles = [
      'media_1793092828527.png',
      'media_1793092875686.png',
      'media_1793093742261.png'
    ];

    const imageInfo: any = {};
    for (const cf of checkFiles) {
      try {
        const p = path.join(artifactsDir, '.user_uploaded', cf);
        const buf = await fs.readFile(p);
        imageInfo[cf] = {
          w: buf.readUInt32BE(16),
          h: buf.readUInt32BE(20),
          size: buf.length
        };
      } catch (e: any) {
        imageInfo[cf] = e.message;
      }
    }

    return NextResponse.json({ success: true, copied, imageInfo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
