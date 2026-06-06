import {Image} from "./image.ts";

export type FilenamePatternPlaceholders = {
  [placeholder: string]: {
    description: string;
    getValue: (image: Image) => string;
  }
};
