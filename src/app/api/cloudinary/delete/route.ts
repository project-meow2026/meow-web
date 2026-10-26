import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, publicId: providedPublicId, resourceType: providedResourceType } = await req.json();

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: 'Cloudinary credentials not configured' },
        { status: 400 }
      );
    }

    let publicId = providedPublicId;
    let resourceType: 'video' | 'image' = providedResourceType || 'video';

    // Parse from URL if publicId wasn't passed directly
    if (!publicId && url) {
      if (url.includes('/video/')) {
        resourceType = 'video';
      } else if (url.includes('/image/')) {
        resourceType = 'image';
      }

      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/k7t4skr1/video/upload/v1792994938/meow/hero/desktop/sample.mp4
      const uploadIdx = url.indexOf('/upload/');
      if (uploadIdx !== -1) {
        let pathAfterUpload = url.substring(uploadIdx + '/upload/'.length);
        // Strip optional transformation/version string like v1792994938/
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
        // Strip file extension
        const dotIdx = pathAfterUpload.lastIndexOf('.');
        if (dotIdx !== -1) {
          pathAfterUpload = pathAfterUpload.substring(0, dotIdx);
        }
        publicId = pathAfterUpload;
      }
    }

    if (!publicId) {
      return NextResponse.json(
        { error: 'Could not resolve publicId to delete' },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const crypto = await import('crypto');
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new URLSearchParams();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    return NextResponse.json({
      success: result.result === 'ok' || result.result === 'not found',
      result,
      publicId,
      resourceType,
    });
  } catch (error: any) {
    console.error('Error in Cloudinary delete route:', error);
    return NextResponse.json(
      { error: error.message || 'Cloudinary delete error' },
      { status: 500 }
    );
  }
}
