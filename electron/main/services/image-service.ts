import crypto from 'node:crypto';
import path from 'node:path';
import { promises as fs } from 'fs';
import exifr from 'exifr';
import { ALLOWED_IMAGE_EXTENSIONS } from '../../../shared/constants/allowed-image-extensions.ts';
import { Image, ImageMetadata } from '../../../shared/types/image.ts';
import { getCachedImage, saveCachedImage } from './database-service.ts';

const toImageMetadata = (exifData: any): ImageMetadata | null => {
  if (!exifData) {
    return null;
  }

  return {
    make: exifData.Make,
    model: exifData.Model,
    lensModel: exifData.LensModel,
    iso: exifData.ISO,
    focalLength: exifData.FocalLength,
    focalLengthEquivalent: exifData.FocalLengthIn35mmFormat,
    exposureTime: exifData.ExposureTime,
    aperture: exifData.FNumber,
    brightnessValue: exifData.BrightnessValue,
    exposureProgram: exifData.ExposureProgram,
    meteringMode: exifData.MeteringMode,
    flash: exifData.Flash,
    flashFired: exifData.Flash !== undefined,
    whiteBalance: exifData.WhiteBalance,
    dateTimeOriginal: exifData.DateTimeOriginal?.toISOString?.() || exifData.DateTimeOriginal,
    dateTimeDigitized: exifData.DateTimeDigitized?.toISOString?.() || exifData.DateTimeDigitized,
    dateTime: exifData.DateTime?.toISOString?.() || exifData.DateTime,
    subsecTimeOriginal: exifData.SubsecTimeOriginal,
    imageWidth: exifData.ImageWidth,
    imageHeight: exifData.ImageHeight,
    xResolution: exifData.XResolution,
    yResolution: exifData.YResolution,
    resolutionUnit: exifData.ResolutionUnit,
    orientation: exifData.Orientation,
    colorSpace: exifData.ColorSpace,
    pixelXDimension: exifData.PixelXDimension,
    pixelYDimension: exifData.PixelYDimension,
    gpsLatitude: exifData.latitude,
    gpsLongitude: exifData.longitude,
    gpsAltitude: exifData.altitude,
    gpsAltitudeRef: exifData.GPSAltitudeRef,
    gpsDateStamp: exifData.GPSDateStamp,
    gpsVersionId: exifData.GPSVersionID,
    gpsMapDatum: exifData.GPSMapDatum,
    artist: exifData.Artist,
    copyright: exifData.Copyright,
    imageDescription: exifData.ImageDescription,
    software: exifData.Software,
    serialNumber: exifData.SerialNumber,
    userComment: exifData.UserComment,
    exposureMode: exifData.ExposureMode,
    exposureBiasValue: exifData.ExposureBiasValue,
    lightSource: exifData.LightSource,
    subjectDistance: exifData.SubjectDistance,
    focusMode: exifData.FocusMode,
    sceneCaptureType: exifData.SceneCaptureType,
    contrast: exifData.Contrast,
    saturation: exifData.Saturation,
    sharpness: exifData.Sharpness,
  };
}

export const readImageFilesRecursive = async (
  dir: string,
  recursive: boolean,
  onProgress?: (current: number, total: number) => void
): Promise<Image[]> => {
  const imagePaths: string[] = [];

  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          if (recursive) {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
            imagePaths.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
  }

  await walk(dir);

  let currentProgress = 0;
  onProgress?.(currentProgress, imagePaths.length);

  const CHUNK_SIZE = 50;
  const results: Image[] = [];

  for (let i = 0; i < imagePaths.length; i += CHUNK_SIZE) {
    const chunk = imagePaths.slice(i, i + CHUNK_SIZE);

    const chunkPromises = chunk.map(async (filePath) => {
      const id = crypto.createHash('md5').update(filePath).digest('hex');

      try {
        const stats = await fs.stat(filePath);
        const mtime = Math.floor(stats.mtimeMs / 1000);

        const cached = getCachedImage(filePath, mtime);
        if (cached) {
          return { ...cached, fromCache: true } as Image;
        }

        const exifData = await exifr.parse(filePath, {
          exif: true,
          makerNote: false,
          gps: true,
        }).catch(() => null);

        const metadata = toImageMetadata(exifData);

        saveCachedImage(id, filePath, path.basename(filePath), metadata, mtime);

        return {
          id,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata,
          fileModificationTime: mtime,
          cachedAt: Math.floor(Date.now() / 1000),
          fromCache: false,
        } as Image;
      } catch (error) {
        const fallbackId = crypto.createHash('md5').update(filePath).digest('hex');
        return {
          id: fallbackId,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata: null,
          fileModificationTime: 0,
          cachedAt: Math.floor(Date.now() / 1000),
          fromCache: false,
        } as Image;
      } finally {
        currentProgress++;
        onProgress?.(currentProgress, imagePaths.length);
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    await new Promise(resolve => setTimeout(resolve, 1));
  }

  return results;
};

