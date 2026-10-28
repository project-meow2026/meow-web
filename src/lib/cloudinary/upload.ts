export type CloudinaryFolder =
  | 'meow/categories'
  | 'meow/products'
  | 'meow/variants'
  | 'meow/hero/desktop'
  | 'meow/hero/mobile'
  | 'meow/preloader'
  | 'meow/banners'
  | 'meow/about'
  | 'meow/collections';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: 'image' | 'video';
  bytes: number;
}

// Strict safety limits to protect Cloudinary Free Tier (25 credits/mo) & prevent site slowdowns
export const MAX_VIDEO_SIZE_MB = 25;
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024; // 25 MB safety limit
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // 10 MB Cloudinary limit

/**
 * Transforms any Cloudinary image URL to serve ultra-fast WebP/AVIF (`f_auto,q_auto`)
 * from Cloudinary CDN edge cache, reducing multi-MB PNGs to ~40KB-100KB.
 */
export const optimizeCloudinaryUrl = (url?: string | null, width?: number): string => {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }
  // Strip any existing f_auto/q_auto segment so we can apply clean width-aware optimization
  const cleanUrl = url.replace(/\/image\/upload\/f_auto[^/]*\//, '/image/upload/');
  const transform = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';
  return cleanUrl.replace('/image/upload/', `/image/upload/${transform}/`);
};

/**
 * Transforms any Cloudinary video URL to stream compressed `f_auto,q_auto` video,
 * cutting bandwidth usage by ~50% and speeding up mobile playback.
 */
export const optimizeCloudinaryVideoUrl = (url?: string | null): string => {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) {
    return url;
  }
  if (url.includes('/video/upload/f_auto') || url.includes('/video/upload/q_auto')) {
    return url;
  }
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
};

/**
 * Automatically compresses large images (> 600 KB) client-side before uploading to Cloudinary
 * so uploads are fast and never hit Cloudinary's 10MB Free Plan limit.
 */
async function compressImageBeforeUpload(file: File): Promise<File> {
  if (
    typeof window === 'undefined' ||
    !file.type.startsWith('image/') ||
    file.type.includes('svg') ||
    file.type.includes('gif') ||
    file.size <= 600 * 1024
  ) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const maxDim = 2000;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const ext = 'webp';
              const baseName = file.name.replace(/\.[^.]+$/, '');
              resolve(new File([blob], `${baseName}.${ext}`, { type: 'image/webp' }));
            } else {
              resolve(file);
            }
          },
          'image/webp',
          0.88
        );
      } catch (_) {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export const uploadMediaToCloudinary = async (
  rawFile: File,
  folder: CloudinaryFolder,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  const isVideo =
    rawFile.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(rawFile.name);
  const resourceType = isVideo ? 'video' : 'image';
  const fileSizeMB = (rawFile.size / (1024 * 1024)).toFixed(1);

  if (isVideo && rawFile.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error(
      `Safety Limit Exceeded: Video is ${fileSizeMB} MB. Maximum allowed video size is ${MAX_VIDEO_SIZE_MB} MB to protect Cloudinary bandwidth & keep your website fast.`
    );
  }

  if (!isVideo && rawFile.size > MAX_IMAGE_SIZE_BYTES * 1.5) {
    throw new Error(
      `Safety Limit Exceeded: Image is ${fileSizeMB} MB. Maximum allowed image size is ${MAX_IMAGE_SIZE_MB} MB.`
    );
  }

  const file = isVideo ? rawFile : await compressImageBeforeUpload(rawFile);

  // 1. Get signed authorization from secure server route
  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, resourceType }),
  });

  if (!signRes.ok) {
    const errData = await signRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to authenticate with Cloudinary');
  }

  const { signature, timestamp, apiKey, cloudName } = await signRes.json();

  // 2. Direct upload to Cloudinary CDN edge (bypasses Next.js server body limits)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && (data.secure_url || data.url)) {
          const rawUrl = data.secure_url || data.url;
          const optimizedUrl =
            resourceType === 'image'
              ? optimizeCloudinaryUrl(rawUrl)
              : optimizeCloudinaryVideoUrl(rawUrl);

          resolve({
            url: optimizedUrl,
            publicId: data.public_id,
            format: data.format,
            resourceType: data.resource_type || resourceType,
            bytes: data.bytes,
          });
        } else {
          reject(new Error(data.error?.message || `Cloudinary rejected upload (${xhr.status})`));
        }
      } catch (e) {
        reject(new Error(`Failed to parse Cloudinary response: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () =>
      reject(new Error('Network error uploading to Cloudinary. Please check your connection.'));
    xhr.ontimeout = () => reject(new Error('Cloudinary upload timed out'));
    xhr.send(formData);
  });
};

export const deleteMediaFromCloudinary = async (
  urlOrPublicId: string,
  resourceType: 'video' | 'image' = 'video'
): Promise<{ success: boolean; error?: string }> => {
  if (!urlOrPublicId) return { success: true };
  try {
    const res = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlOrPublicId, resourceType }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to delete from Cloudinary' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('deleteMediaFromCloudinary error:', err);
    return { success: false, error: err.message };
  }
};
