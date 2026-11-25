// Resizes an image file in the browser and returns it as a JPEG data URL.
// Images are stored directly in Firestore (no Firebase Storage needed).
// Firestore documents are limited to 1 MB, so we keep images small.
export async function imageToDataUrl(file, maxSize = 900, quality = 0.8) {
    const url = URL.createObjectURL(file);
    try {
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Unable to read this image'));
            image.src = url;
        });

        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);
        // Stay well under the 1 MB Firestore limit
        while (dataUrl.length > 700_000 && q > 0.3) {
            q -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', q);
        }
        return dataUrl;
    } finally {
        URL.revokeObjectURL(url);
    }
}
