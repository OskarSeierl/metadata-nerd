import {Tags} from "exiftool-vendored";
import {Override} from "./override.ts";

/**
 * Comprehensive EXIF and image metadata interface
 * Covers common fields from EXIF, IPTC, and file metadata
 */
export type ImageMetadata = Override<Tags, {
  DateTimeOriginal?: string; // Date photo was taken (ISO 8601)
}>;

export interface Image {
  /** Unique ID (hash of fullPath) */
  id: number;
  /** Full absolute path to the image file */
  fullPath: string;
  /** Filename without directory path */
  filename: string;
  /** Parsed EXIF and image metadata */
  metadata: ImageMetadata | null;
  /** File modification time in seconds (for cache invalidation) */
  fileModificationTime: number;
  /** Unix timestamp when metadata was cached */
  cachedAt: number;
  /** Whether this image came from cache or was freshly read */
  fromCache: boolean;
}
