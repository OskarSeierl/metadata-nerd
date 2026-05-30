/**
 * Comprehensive EXIF and image metadata interface
 * Covers common fields from EXIF, IPTC, and file metadata
 */
export interface ImageMetadata {
  // Camera/Device Information
  make?: string; // Camera manufacturer
  model?: string; // Camera model
  lensModel?: string; // Lens model

  // Photo Settings
  iso?: number; // ISO sensitivity
  focalLength?: number; // Focal length in mm
  focalLengthEquivalent?: number; // 35mm equivalent focal length
  exposureTime?: number; // Shutter speed in seconds
  aperture?: number; // F-number (aperture)
  brightnessValue?: number;
  exposureProgram?: number;
  meteringMode?: number;
  flash?: number;
  flashFired?: boolean;
  whiteBalance?: number;

  // Date/Time
  dateTimeOriginal?: string; // Date photo was taken (ISO 8601)
  dateTimeDigitized?: string; // Date photo was digitized
  dateTime?: string; // File modification date
  subsecTimeOriginal?: string; // Subsecond time

  // Image Properties
  imageWidth?: number; // Width in pixels
  imageHeight?: number; // Height in pixels
  xResolution?: number; // Horizontal resolution
  yResolution?: number; // Vertical resolution
  resolutionUnit?: string; // DPI or PPCM
  orientation?: number; // Image orientation (1-8)
  colorSpace?: string; // Color space (sRGB, AdobeRGB, etc.)
  pixelXDimension?: number;
  pixelYDimension?: number;

  // GPS Information
  gpsLatitude?: number; // Decimal degrees
  gpsLongitude?: number; // Decimal degrees
  gpsAltitude?: number; // Meters above sea level
  gpsAltitudeRef?: number;
  gpsDateStamp?: string;
  gpsVersionId?: string;
  gpsMapDatum?: string;

  // Copyright & Description
  artist?: string; // Photographer name
  copyright?: string; // Copyright notice
  imageDescription?: string; // Image description
  software?: string; // Software used to process
  processingMode?: string; // Processing software/mode

  // Additional EXIF Fields
  serialNumber?: string; // Camera serial number
  userComment?: string; // User comments
  maker?: string; // Maker note data (presence indicator)
  exposureMode?: number; // Manual, Auto, etc.
  exposureBiasValue?: number;
  lightSource?: number;
  subjectDistance?: number;
  focusMode?: number;
  sceneCaptureType?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;

  // File-level metadata
  fileSize?: number; // File size in bytes
  mimeType?: string; // MIME type (image/jpeg, etc.)
  hasAlpha?: boolean; // Alpha channel present
  hasAnimation?: boolean; // Animated image (GIF, APNG, etc.)

  // Custom/Extended Fields
  [key: string]: any; // Allow for additional unknown fields
}

export interface Image {
  /** Unique ID (hash of fullPath) */
  id: string;
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
