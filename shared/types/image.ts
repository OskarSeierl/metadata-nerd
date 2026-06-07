/**
 * Comprehensive EXIF and image metadata interface
 * Covers common fields from EXIF, IPTC, and file metadata
 */
export interface ImageMetadata {
  dateTimeOriginal?: string; // Date photo was taken (ISO 8601)

  gpsLatitude?: number; // Decimal degrees
  gpsLongitude?: number; // Decimal degrees

  [key: string]: unknown; // Allow for additional unknown fields
}

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
