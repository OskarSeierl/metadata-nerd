import { Image } from "../types/image.ts";

export const exampleImageData: Image = {
  id: 'b23bffe6b1bcca6eb6b6ebff1a33f5bb',
  fullPath: 'C:\\Users\\Oskar\\Documents\\Fujifilm_FinePix6900ZOOM.jpg',
  filename: 'Fujifilm_FinePix6900ZOOM.jpg',
  metadata: {
    // --- 1. Hardware & Origin ---
    Make: 'FUJIFILM',
    Model: 'FinePix6900ZOOM',
    LensModel: 'Fujinon 35-105mm f/2.0-2.8',
    SerialNumber: 'FG9X882310',
    Software: 'GIMP 2.4.5',

    // --- 2. Photographic & Exposure Data ---
    ISO: 100, // Note: Some raw parsers use ISOSpeedRatings, but ISO is the common ExifTool extraction
    FocalLength: 21.8,
    FocalLengthIn35mmFormat: 105,
    FNumber: 4,                 // EXIF spec uses FNumber, not Aperture
    ExposureTime: 0.004,
    BrightnessValue: 7.49,
    ExposureBiasValue: 0,
    ExposureProgram: 'Normal program',
    ExposureMode: 'Auto',
    MeteringMode: 'Pattern',
    WhiteBalance: 'Auto',
    LightSource: 'Unknown',
    Flash: 'Flash did not fire',
    SubjectDistance: 3.5,
    FocusMode: 'Auto',
    SceneCaptureType: 'Standard',
    Contrast: 'Normal',
    Saturation: 'Normal',
    Sharpness: 'Normal',

    // --- 3. Dates & Times ---
    DateTimeOriginal: '2001-02-19T05:40:05.000Z',
    DateTimeDigitized: '2001-02-19T05:40:05.000Z',
    DateTime: '2008-03-15T12:15:30.000Z',
    SubsecTimeOriginal: '00',

    // --- 4. File & Display Properties ---
    ImageWidth: 2832,
    ImageHeight: 2128,
    XResolution: 72,
    YResolution: 72,
    ResolutionUnit: 'inches',
    Orientation: 'Horizontal (normal)',
    ColorSpace: 1,

    // --- 5. Location Data (GPS) ---
    // Note: If you use exifr, it usually outputs lowercase latitude/longitude natively,
    // but strict EXIF/ExifTool uses GPSLatitude. I'll use the strict EXIF format here.
    GPSLatitude: 48.2082,
    GPSLongitude: 16.3738,
    GPSAltitude: 190.5,
    GPSAltitudeRef: 0,
    GPSDateStamp: '2001:02:19',

    // --- 6. Descriptive / IPTC Data ---
    Artist: 'Oskar',
    Copyright: '© 2001 Oskar Photography',
    ImageDescription: 'A beautiful test shot taken with a classic Fujifilm camera.',
    UserComment: 'Needs minor color correction on the sky.'
  },
  fileModificationTime: 1780845394,
  cachedAt: 1780845407,
  fromCache: true
};
