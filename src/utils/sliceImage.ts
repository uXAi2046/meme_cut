import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface SliceResult {
  blob: Blob;
  url: string;
  filename: string;
  row: number;
  col: number;
}

export type ExportFormat = 'png' | 'jpg' | 'webp';
export type RatioMode = 'original' | 'square';

export interface SliceConfig {
  file: File;
  rows: number;
  cols: number;
  ratioMode: RatioMode;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  format: ExportFormat;
  prefix: string;
}

export const sliceImage = async (
  config: SliceConfig
): Promise<{ slices: SliceResult[]; zipBlob: Blob }> => {
  const { file, rows, cols, ratioMode, margins, format, prefix } = config;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const { width: originalWidth, height: originalHeight } = img;

        // Base crop according to ratio mode
        let baseX = 0;
        let baseY = 0;
        let baseW = originalWidth;
        let baseH = originalHeight;

        if (ratioMode === 'square') {
          const side = Math.min(originalWidth, originalHeight);
          baseX = Math.floor((originalWidth - side) / 2);
          baseY = Math.floor((originalHeight - side) / 2);
          baseW = side;
          baseH = side;
        }
        
        // Apply margins within base crop
        const sourceX = baseX + margins.left;
        const sourceY = baseY + margins.top;
        const sourceWidth = Math.max(1, baseW - margins.left - margins.right);
        const sourceHeight = Math.max(1, baseH - margins.top - margins.bottom);

        // Dimensions per block (source space)
        const sourceBlockWidth = Math.floor(sourceWidth / cols);
        const sourceBlockHeight = Math.floor(sourceHeight / rows);

        const slices: SliceResult[] = [];
        const zip = new JSZip();

        // Map format to MIME type
        const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
        const fileExt = format === 'jpg' ? 'jpg' : format;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const sx = sourceX + c * sourceBlockWidth;
            const sy = sourceY + r * sourceBlockHeight;
            const sw = (c === cols - 1) ? (sourceWidth - c * sourceBlockWidth) : sourceBlockWidth;
            const sh = (r === rows - 1) ? (sourceHeight - r * sourceBlockHeight) : sourceBlockHeight;

            const canvas = document.createElement('canvas');
            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

            const blob = await new Promise<Blob | null>((resolveBlob) =>
              canvas.toBlob(resolveBlob, mimeType, 0.92)
            );

            if (blob) {
              const baseName = prefix || file.name.split('.')[0];
              const filename = `${baseName}_${r + 1}_${c + 1}.${fileExt}`;
              const url = URL.createObjectURL(blob);
              
              slices.push({
                blob,
                url,
                filename,
                row: r,
                col: c,
              });

              zip.file(filename, blob);
            }
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        resolve({ slices, zipBlob });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const downloadZip = (zipBlob: Blob, filename = 'images.zip') => {
  saveAs(zipBlob, filename);
};
