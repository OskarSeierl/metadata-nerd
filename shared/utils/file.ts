import {Image} from "../types/image.ts";
import {patternPlaceholders} from "../constants/file-name-placeholders.ts";
import {FilenamePatternPlaceholders} from "../types/file-name.ts";

export const sanitizeForFilename = (name: string): string => {
  return name.replace(/[\\/:*?"<>|]/g, '-');
};

export const replacePlaceholdersInPattern = (pattern: string, index: number, image: Image): string => {
  return pattern.replace(/<([^>]+)>/g, (_match, placeholder) => {
    // Step A: Check if it's a known special placeholder (YYYY, MM, COUNTER, etc.)
    if (placeholder in patternPlaceholders) {
      const key = placeholder as keyof FilenamePatternPlaceholders;
      return String(patternPlaceholders[key].getValue(index, image));
    }

    // Step B: Fallback to dynamic metadata lookup
    if (image.metadata && placeholder in image.metadata) {
      const metaValue = image.metadata[placeholder];

      // Ensure we only convert primitive values to strings (ignore nested objects/arrays if any exist)
      if (typeof metaValue === 'string' || typeof metaValue === 'number' || typeof metaValue === 'boolean') {
        return String(metaValue);
      }
    }

    // Step C: If the placeholder is completely unknown or the metadata is missing
    return "Unknown";
  });
};
