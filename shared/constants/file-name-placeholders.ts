import {FilenamePatternPlaceholders} from "../types/file-name.ts";
import {
  getPaddedDayOfDate,
  getPaddedHourOfDate,
  getPaddedMinuteOfDate,
  getPaddedMonthOfDate, getPaddedSecondOfDate,
  getYearOfDate
} from "../utils/time.ts";

export const patternPlaceholders: FilenamePatternPlaceholders = {
  YYYY: {
    description: "The 4-digit year (e.g., 2026).",
    getValue: (_i, image) => getYearOfDate(image.metadata?.dateTimeOriginal)
  },
  MM: {
    description: "The 2-digit month, zero-padded (01-12).",
    getValue: (_i, image) => getPaddedMonthOfDate(image.metadata?.dateTimeOriginal)
  },
  DD: {
    description: "The 2-digit day, zero-padded (01-31).",
    getValue: (_i, image) => getPaddedDayOfDate(image.metadata?.dateTimeOriginal)
  },
  hh: {
    description: "The 2-digit hour in 24-hour format, zero-padded (00-23).",
    getValue: (_i, image) => getPaddedHourOfDate(image.metadata?.dateTimeOriginal)
  },
  mm: {
    description: "The 2-digit minute, zero-padded (00-59).",
    getValue: (_i, image) => getPaddedMinuteOfDate(image.metadata?.dateTimeOriginal)
  },
  ss: {
    description: "The 2-digit second, zero-padded (00-59).",
    getValue: (_i, image) => getPaddedSecondOfDate(image.metadata?.dateTimeOriginal)
  },
  COUNTER: {
    description: "A sequential 4-digit number giving each image a unique identifier (0001, 0002, ...).",
    getValue: (i) => String(i + 1).padStart(4, '0')
  },
  ORIG_FILENAME: {
    description: "The original filename, excluding the file extension.",
    getValue: (_i, image) => image.filename.replace(/\.[^/.]+$/, "")

  },
};
