import {FilenamePatternPlaceholders} from "../types/file-name.ts";

export const patternPlaceholders: FilenamePatternPlaceholders = {
  YYYY: {
    description: "The 4-digit year (e.g., 2026).",
    getValue: image => ""
  },
  MM: {
    description: "The 2-digit month, zero-padded (01-12).",
    getValue: image => ""
  },
  DD: {
    description: "The 2-digit day, zero-padded (01-31).",
    getValue: image => ""
  },
  COUNTER: {
    description: "A sequential 3-digit number giving each image a unique identifier (001, 002, ...).",
    getValue: image => ""
  },
  ORIG_FILENAME: {
    description: "The original filename, excluding the file extension.",
    getValue: image => ""
  },
};
