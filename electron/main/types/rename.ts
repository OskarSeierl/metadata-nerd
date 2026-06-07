import {Image} from "../../../shared/types/image.ts";

export interface RenamePlan {
  image: Image;
  tempFullPath: string;
  newFullPath: string;
  newFilename: string;
  needsRename: boolean;
}
