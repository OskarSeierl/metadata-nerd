import {BrowserWindow, dialog, ipcMain} from 'electron';
import {promises as fs} from 'fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ALLOWED_IMAGE_EXTENSIONS} from "../../../shared/constants/allowed-image-extensions.ts";
import {Image, ImageMetadata} from "shared/types/image.ts";
import exifr from 'exifr';
import {getCachedImage, saveCachedImage} from '../database';
import {ReadImageFilesResult, ResponseData} from "../../../shared/types/electron-api.ts";

import {generateAndStoreThumbnail} from "./thumbnail-handler.ts";

export async function readImageFilesRecursive(dir: string, recursive: boolean): Promise<Image[]> {
  const imagePaths: string[] = [];

  // 1. FAST PHASE: Just find all the valid file paths first
  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, {withFileTypes: true});

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

  // 2. HEAVY PHASE: Read metadata for all found images concurrently
  return await Promise.all(
    imagePaths.map(async (filePath) => {
      try {
        // Check file modification time
        const stats = await fs.stat(filePath);
        const mtime = Math.floor(stats.mtimeMs / 1000);

        // Eindeutige ID für das Bild und das Thumbnail generieren
        const id = crypto.createHash('md5').update(filePath).digest('hex');

        // Try to get from cache first
        const cached = getCachedImage(filePath, mtime);
        if (cached) {
          console.log(`Cache hit: ${filePath}`);
          return {...cached, fromCache: true};
        }

        // Not in cache or invalidated, read metadata
        console.log(`Cache miss: ${filePath}`);

        // Read metadata and thumbnail in parallel
        const [exifData, _] = await Promise.all([
          exifr.parse(filePath, {
            exif: true,
            makerNote: false,
            gps: true
          }).catch(e => {
            console.warn(`Could not parse EXIF for ${filePath}`, e);
            return null;
          }),
          generateAndStoreThumbnail(filePath, id),
        ]);

        // Map exifr data to our typed ImageMetadata interface
        const metadata: ImageMetadata | null = exifData ? {
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
        } : null;

        // Save to cache (with optional thumbId)
        saveCachedImage(id, filePath, path.basename(filePath), metadata, mtime);

        const now = Math.floor(Date.now() / 1000);
        return {
          id,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata,
          fileModificationTime: mtime,
          cachedAt: now,
          fromCache: false,
        } as Image;

      } catch (error) {
        console.warn(`Critical error processing ${filePath}`, error);

        const stats = await fs.stat(filePath).catch(() => null);
        const mtime = stats ? Math.floor(stats.mtimeMs / 1000) : 0;
        const now = Math.floor(Date.now() / 1000);

        // Fallback ID falls sogar der Dateizugriff scheitert, aber wir den Pfad haben
        const fallbackId = crypto.createHash('md5').update(filePath).digest('hex');

        return {
          id: fallbackId,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata: null,
          fileModificationTime: mtime,
          cachedAt: now,
          fromCache: false,
        } as Image;
      }
    })
  );
}

export function registerFolderHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle('read-image-files', async (_event, folderPath: string, includeSubfolders: boolean): Promise<ResponseData<ReadImageFilesResult>> => {
    try {
      if (!folderPath) {
        throw new Error('Folder path is required');
      }

      const imageFiles = await readImageFilesRecursive(folderPath, includeSubfolders);
      return {
        success: true,
        data: {
          count: imageFiles.length,
          images: imageFiles,
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        data: {
          count: 0,
          images: [],
        }
      };
    }
  });
}
