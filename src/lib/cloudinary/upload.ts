export type CloudinaryFolder =
  | 'meow/categories'
  | 'meow/products'
  | 'meow/variants'
  | 'meow/hero/desktop'
  | 'meow/hero/mobile'
  | 'meow/preloader'
  | 'meow/banners'
  | 'meow/about';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: 'image' | 'video';
  bytes: number;
}

export const uploadMediaToCloudinary = async (
  file: File,
  folder: CloudinaryFolder,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
  const resourceType = isVideo ? 'video' : 'image';
  const maxSizeBytes = isVideo ? 150 * 1024 * 1024 : 20 * 1024 * 1024; // 150MB for video, 20MB for image

  if (file.size > maxSizeBytes) {
    throw new Error(
      `File size exceeds limit (${isVideo ? '150MB for video' : '20MB for image'})`
    );
  }

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
          resolve({
            url: data.secure_url || data.url,
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

    xhr.onerror = () => reject(new Error('Network error uploading to Cloudinary. Please check your connection.'));
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
